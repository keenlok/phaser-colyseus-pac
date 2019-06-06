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
        //TODO: Create new character
        console.log("client joins room")
      }
    })
    room.listen('enemies/:id/:attribute', ({path: {attribute, id}, operation, value}) => {
      let enemy = this.enemieslist[id]
      // if (objToUpdate.mode !== objToUpdate.AT_HOME || objToUpdate.mode !== objToUpdate.EXIT_HOME) {
        if (attribute === 'x' || attribute === 'y') {
          console.log("What is received for enemy", operation, id, attribute, value)
          enemy[attribute] = value
        } else if (attribute === 'currDir') {
          enemy.playRespectiveAnimation(value)
        }
      // }
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
