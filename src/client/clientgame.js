import MainGame from "./scenes/MainGame"
import {directions} from '../shared/config/constants'
import {wsUrl} from '../shared/config/config'

import {Client} from "colyseus.js"
import Phaser from 'phaser'

class ClientGame extends MainGame {
  constructor() {
    super({key: 'maingame'})
    console.log("Main game")
  }

  init (data) {
    this.options = data
    console.log(data)

  }
  create() {
    super.create()
    this.createRoom(this.options)
    this.createListeners()
  }

  createListeners() {
    this.events.on('player_created', (player) => {
      console.log('Player created, sending confirmation to server')
      this.room.send('client_player_created')
    })

    this.input.on('pointerup', this.endSwipe, this)
  }

  createRoom(options) {
    console.log(options)
    let roomName
    if (typeof options === "undefined") {
      roomName = 'practice'
    } else {
      roomName = options.room
    }

    const client = new Client(wsUrl)
    console.log("What is my id?", client.id)
    this.clientId = client.id

    console.log("Joining rooms")
    // const room = client.join('2player')
    const room = client.join(roomName)
    // const room = client.join('practice')
    console.log("Joined room", room)
    this.room = room

    room.onJoin.add(() => {
      console.log("client joins room")
      room.listen('players/:id', ({path: {id}, operation, value}) => {
        if (operation === 'add') {
          console.log("Creating new player!", id)
          this.createNewPlayer(id)
        } else if (operation === 'remove') {
          console.log("This player quit", id)
        }
      })
      room.listen('players/:id/:attribute', ({path: {attribute, id}, operation, value}) => {
        if (operation === "replace" || operation === "remove") {
          if (attribute === 'x' || attribute === 'y') {
            this.players[id][attribute] = value
          }
          else if (attribute === 'velocityX') {
            this.players[id].body.setVelocityX(value)
          }
          else if (attribute === 'velocityY') {
            this.players[id].body.setVelocityY(value)
          }
          else if (attribute === 'currDir') {
            console.log(`Player ${id}:`, attribute, value)
            this.players[id].move(value)
          }
          else if (attribute === 'isPowUp') {
            this.players[id][attribute] = value
          }
          else if (attribute === 'isDead' || attribute === 'alive') {
            this.players[id][attribute] = value
            // ie it died
            // if (!value) {
            //   this.scuttle.dies()
            // }
          }
          else if (attribute === 'score') {
            if (this.clientId === id) {
              // this.players[id].score = data
              this.increaseScore(value)
            }
          }
          else {
            console.log("What is received player", id, value, attribute)
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
        // if (attribute === 'score') {
        //   this.increaseScore(value)
        // } else {
          console.log("What is received for world", operation, attribute, value)
        // }
      })

      room.onMessage.add((message) => {
        if (typeof message === 'string') {
          if (message === 'start') {
            console.log('start!')
            this.scene.resume()
          } else if (message.startsWith('hunt')) {
            let args = message.split('_')
            let id = args[1]
            console.log("Room: ", "Change game to hunt", id)
            this.changeToHuntMode(this.players[id])
          } else if (message === 'normal') {
            console.log("Room: ", "Change game to normal")
            this.returnToNormal()
          } else if (message.startsWith('restart')) {
            let id = message.substr(8)
            console.log("this id received to restart", id)
            this.restartGame(this.players[id])
          } else if (message.startsWith("eat_enemy")) {
            let substr = message.substr(10)
            let args = substr.split('_')
            let enemy_id = args[0]
            let player_id = args[1]
            console.log(`Enemy ${enemy_id} died by ${player_id}'s hands`)
            this.enemieslist[enemy_id].dies(this.players[player_id])
          } else if (message.startsWith("enemy_exit")) {
            let id = message.substr(11)
            console.log("Enemy exit! received")
            this.enemieslist[id].delayedSpawn()
          } else if (message.startsWith("eat_player")) {
            let numplayer = message.substr(11)
            console.log("What is received???", message)
            let args = numplayer.split('_')
            let num = args[0]
            let id = args[1]
            console.log("This audio num is to be played", num)
            console.log("This player is eated", id)
            this.scuttleDies(num, this.players[id])
          } else {
            console.log("Room: Received:", message)
          }
        } else {
          console.log("Room:    What is received from server?", message)
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

  endSwipe (event) {
    let room = this.room
    // Variables used for dragging in phaser
    let swipeTime = event.upTime - event.downTime
    let swipe = new Phaser.Geom.Point(event.upX - event.downX, event.upY - event.downY)
    let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe)
    let swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude)

    if (swipeMagnitude > 20 && swipeTime < 1000 &&
      (Math.abs(swipeNormal.x) > 0.8 || Math.abs(swipeNormal.y) > 0.8)) {
      if (swipeNormal.x > 0.8) {
        room.send({move: directions.RIGHT})
        console.log('swiping right')
      }
      if (swipeNormal.x < -0.8) {
        room.send({move: directions.LEFT})
        console.log('swiping left')
      }
      if (swipeNormal.y > 0.8) {
        room.send({move: directions.DOWN})
        console.log('swiping down')
      }
      if (swipeNormal.y < -0.8) {
        room.send({move: directions.UP})
        console.log('swiping up')
      }
    }
  }
}


export default ClientGame
