import MainGame from "./scenes/MainGame"
import {TileSize} from '../shared/config/constants'

import {Client} from "colyseus.js"
import {Math} from 'phaser'

class ClientGame extends MainGame {
  constructor() {
    super({key: 'maingame'})
    console.log("Main game")
  }

  create() {
    super.create()
    this.createRoom()
  }

  createRoom() {
    const client = new Client('ws://127.0.0.1:8000')

    console.log("Joining rooms")
    const room = client.join('room')
    console.log("Joined room", room)
    this.room = room

    room.listen('players/:id', ({path: {id}, operation, value}) => {
      if (operation === "add") {
        console.log("client joins room")
      }
    })
    room.listen('enemies/:id/:attribute', ({path, operation, value}) => {
      let objToUpdate = this.enemieslist[path.id]
      if (objToUpdate.mode !== objToUpdate.AT_HOME || objToUpdate.mode !== objToUpdate.EXIT_HOME) {
        // if (path.attribute === 'x' || path.attribute === 'y') {
          // if (!Math.Fuzzy.Equal(objToUpdate[path.attribute], value, TileSize)) {
            console.log("What is received for enemy", operation, path.id, path.attribute, value)
            objToUpdate[path.attribute] = value
          // }
        // }
      }
    })
    room.onMessage.add((message) => {
      if (message === 'start') {
        console.log('start!')
        this.scene.resume()
      }
    })
  }
}

export default ClientGame
