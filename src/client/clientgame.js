import MainGame from "./scenes/MainGame"
import {directions} from '../shared/config/constants'

import {Client} from "colyseus.js"
import Phaser from 'phaser'

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
    const room = client.join('practice')
    console.log("Joined room", room)
    this.room = room

    room.onJoin.add(() => {
      //TODO: Create new character
      console.log("client joins room")
      room.listen('players/:id', ({path: {id}, operation, value}) => {
        if (operation === 'add') {
          console.log("This ids are available", id)
        } else if (operation === 'remove') {
          console.log("This player quit", id)
        }
      })
      //TODO: Allow multiple clients
      room.listen('players/:id/:attribute', ({path: {attribute, id}, operation, value}) => {
        if (operation === "replace" || operation === "remove") {
          if (attribute === 'x' || attribute === 'y') {
            this.scuttle[attribute] = value
          } else if (attribute === 'velocityX' ) {
            this.scuttle.body.setVelocityX(value)
          } else if (attribute === 'velocityY') {
            this.scuttle.body.setVelocityY(value)
          }
          if (attribute === 'currDir') {
            console.log(`Player ${id}:`, attribute, value)
            this.scuttle.move(value)
          }
          if (attribute === 'isPowUp') {
            this.scuttle[attribute] = value
          }
          if (attribute === 'isDead' || attribute === 'alive') {
            this.scuttle[attribute] = value
            // ie it died
            // if (!value) {
            //   this.scuttle.dies()
            // }
          }
        }
      })
      room.listen('enemies/:id/:attribute', ({path: {attribute, id}, operation, value}) => {
        let enemy = this.enemieslist[id]
        // if (objToUpdate.mode !== objToUpdate.AT_HOME || objToUpdate.mode !== objToUpdate.EXIT_HOME) {
        if (attribute === 'x' || attribute === 'y') {
          enemy[attribute] = value
        } else if (attribute === 'currDir') {
          enemy.move(value)
        } else if (attribute === 'velocityX' ) {
          enemy.body.setVelocityX(value)
        } else if (attribute === 'velocityY') {
          enemy.body.setVelocityY(value)
        } else if (attribute === 'mode') {
          enemy.behaveAccordingly(value)
        } else if (attribute === 'isFrightened' || attribute === 'isDead') {
          console.log("What is received for enemy", operation, id, attribute, value)
          enemy[attribute] = value
        }
        // }
      })

      room.listen('world/:attribute', ({path: {attribute}, operation, value}) => {
        if (attribute === 'score') {
          this.increaseScore(value)
        } else {
          console.log("What is received for world", operation, attribute, value)
        }
      })

      room.onMessage.add((message) => {
        if (message === 'start') {
          console.log('start!')
          this.scene.resume()

        } else if (message === 'hunt') {
          console.log("Room: ", "Change game to hunt")
          this.changeToHuntMode(this.scuttle)
        } else if (message === 'normal') {
          console.log("Room: ", "Change game to normal")
          this.returnToNormal()
        } else if (message.startsWith("eat_enemy")) {
          let id = message.substr(10)
          console.log("Enemy died", id)
          this.enemieslist[id].dies()
        } else if (message.startsWith("enemy_exit")) {
          let id = message.substr(11)
          console.log("Enemy exit! received")
          this.enemieslist[id].delayedSpawn()
        } else if (message.startsWith("eat_player")) {
          //TODO: CHANGE WHEN MULTIPLAYER ALLOWED.
          let numplayer = message.substr(11)
          let args = numplayer.split('_')
          let num = args[0]
          console.log("This audio num is to be played", num)
          this.scuttleDies(num, this.scuttle)
        } else {
          console.log("Room: Received:", message)
        }
      })
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
