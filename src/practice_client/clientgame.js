import MainGame from "./scenes/MainGame"
import {directions} from '../shared/config/constants'

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

    room.onJoin.add(() => {
      //TODO: Create new character

      console.log("client joins room")
    })

    room.listen('players/:id/:attribute', ({path: {attribute, id}, operation, value}) => {
      if (operation === "replace" || operation === "remove") {
        console.log(`Player ${id}:`, attribute, value)
        if (attribute === 'x' || attribute === 'y') {
          this.scuttle[attribute] = value
        }
        if (attribute === 'currDir') {
          this.scuttle.move(value)
        }
        // if (attribute === 'isPowUp') {
        //
        // }
      }
    })
    room.listen('enemies/:id/:attribute', ({path: {attribute, id}, operation, value}) => {
      let enemy = this.enemieslist[id]
      // if (objToUpdate.mode !== objToUpdate.AT_HOME || objToUpdate.mode !== objToUpdate.EXIT_HOME) {
        if (attribute === 'x' || attribute === 'y') {
          // console.log("What is received for enemy", operation, id, attribute, value)
          enemy[attribute] = value
        } else if (attribute === 'currDir') {
          // console.log("What is received for enemy", operation, id, attribute, value)
          enemy.move(value)
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

  update() {
    let cursors = this.cursors
    let room = this.room
    if (cursors.LEFT.isDown || cursors.A.isDown) {
      room.send({move: directions.LEFT})
    } else if (cursors.RIGHT.isDown || cursors.D.isDown) {
      room.send({move: directions.RIGHT})
    } else if (cursors.UP.isDown || cursors.W.isDown) {
      room.send({move: directions.UP})
    } else if (cursors.DOWN.isDown || cursors.S.isDown) {
      room.send({move: directions.DOWN})
    }
  }
}

export default ClientGame
