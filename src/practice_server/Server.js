import {JSDOM} from 'jsdom'
import Datauri from'datauri'
import path from'path'

const datauri = new Datauri()

export class gameServer {
  constructor() {
    this.game = undefined
    // this.jsdom1
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
        // console.log(dom.window.game)
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
}


import http from 'http'
import { Server } from 'colyseus'
import { GameRoom } from './GameRoom'

const server = http.Server();

const colyServer = new Server({
  server: server
})

colyServer.register("room", GameRoom)

// let game_server = new gameServer()
// game_server.setupAuthoritativeServer()

colyServer.listen(8000, undefined, undefined, function () {
  console.log(`Listening on ${server.address().port}`);
});

console.log("Hello")