import { Scene, Game, AUTO } from 'phaser'
import { Client } from 'colyseus.js'
import * as constants from "../config/constants"

const client = new Client('ws://127.0.0.1:8000')

class ClientGame extends Scene {
  constructor() {
    super({key: 'maingame'})
    console.log("Main game")
  }

  preload() {

  }

  create() {
    console.log("Joining rooms")
    const room = client.join('room')
    console.log("Joined room", room)
    this.room = room

    room.listen('players/:id', ({path: {id}, operation, value}) => {
      if (operation === "add") {
        console.log("client joins room")
      }
    })
  }
}
const config = {
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: constants.DEBUG
    }
  },
  scene: ClientGame
}
const game = new Game(config)

