import {JSDOM} from 'jsdom'
import Datauri from'datauri'
import path from'path'

const datauri = new Datauri()

export class gameServer {
  constructor() {
    this.game = undefined
    this.window = undefined
    this.scene = undefined
  }

  setupAuthoritativeServer() {
    let self = this
    this.jsdom1 = JSDOM.fromFile(path.join(__dirname, 'index.html'), {
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true
    }).then((dom) => {
      dom.window.gameLoaded = () => {
        self.window = dom.window
        self.game = dom.window.game
        console.log("is this a game", typeof self.game !== 'undefined')
      }
      dom.window.URL.createObjectURL = (blob) => {
        if (blob) {
          return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
        }
      }
      dom.window.URL.revokeObjectURL = (objectURL) => {
      };
    }).catch((error) => {
      console.log(error.message);
    });
  }

  getGame() {
    return new Promise((resolve, reject) => {
      let self = this
      let interval = setInterval(() => {
        if (typeof self.game !== 'undefined') {
          let scene = self.game.scene.scenes[0]
          self.scene = scene
          // if (scene.group !== null) {
            if (typeof scene.enemies !== "undefined") {
              clearInterval(interval)
              resolve(self.game)
            }
          }
        }, 1)
    })
  }

  getScene() {
    if (typeof this.scene === "undefined") {
      return new Promise((resolve, reject) => {
        let self = this
        let interval = setInterval(() => {
          if (typeof self.scene !== 'undefined') {
            clearInterval(interval)
            resolve(self.scene)
          }
        }, 1)
      })
    } else {
      return this.scene
    }
  }

  dispose () {
    console.log("Destroying game!")
    // this.game.destroy(true)
    this.window.close() // Fastest way to destroy the game is to close the dom.
    // this.window.game = null
    // this.game = null
    // this.scene = null
  }


  createNewPlayers(id) {
    // console.log('Server:  does it come here')
    let self = this
    let game, scene
    // if (typeof self.scene === "undefined" || self.scene === undefined) {
    console.log('Server:  does it come here await')
    let promise = self.getGame()
    promise.then((game) => {
      scene = this.scene
      console.log('Server:  does it go past await')
      scene.createNewPlayer(id)
    }).catch((err)=> {
      console.log("Error in creating new players!", err)
    })
    // } else {
    //   console.log('Server:  does it come here instead to undefined', self.scene.createNewPlayer)
    //   scene = self.scene
    //   scene.createNewPlayer(id)
    // }
  }
}


import http from 'http'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import * as cors from 'cors'
import * as express from 'express'
import { PracticeRoom } from './Rooms/PracticeRoom'
import { MultiplayerRoom } from './Rooms/MultiplayerRoom'

const app = express();
const server = http.Server(app);

const colyServer = new Server({
  server: server
})

const PORT = 8000

colyServer.register("practice", PracticeRoom, { server: gameServer })
colyServer.register("2player", MultiplayerRoom, { server: gameServer })

// let game_server = new gameServer()
// game_server.setupAuthoritativeServer()

app.use(cors())
app.use("/colyseus", monitor(colyServer))

colyServer.listen(PORT, undefined, undefined, function () {
  console.log(`Listening on ws://${server.address().port}`);
});

console.log("Hello")