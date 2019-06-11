import {JSDOM} from 'jsdom'
import Datauri from'datauri'
import path from'path'

const datauri = new Datauri()

export class gameServer {
  constructor() {
    this.game = undefined
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

  async createNewPlayers(id) {
    // console.log('Server:  does it come here')
    let self = this
    let game, scene
    if (typeof self.scene === "undefined" || self.scene === undefined) {
      // console.log('Server:  does it come here await')
      game = await self.getGame()
      scene = this.scene
      // console.log('Server:  does it go past await')
    } else {
      // console.log('Server:  does it come here instead to undefined')
      scene = this.scene
    }
    scene.createNewPlayer(id)
  }
}


import http from 'http'
import { Server } from 'colyseus'
import { PracticeRoom } from './Rooms/PracticeRoom'
import { MultiplayerRoom } from './Rooms/MultiplayerRoom'

const server = http.Server();

const colyServer = new Server({
  server: server
})

colyServer.register("practice", PracticeRoom, { server: gameServer })
colyServer.register("2player", MultiplayerRoom, { server: gameServer })

// let game_server = new gameServer()
// game_server.setupAuthoritativeServer()

colyServer.listen(8000, undefined, undefined, function () {
  console.log(`Listening on ${server.address().port}`);
});

console.log("Hello")