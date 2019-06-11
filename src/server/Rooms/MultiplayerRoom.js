import { Room,  FossilDeltaSerializer, serialize} from 'colyseus'

import { messageLog, DEBUG } from '../../shared/config/constants'
import { State } from "../states/objectStates"

export class MultiplayerRoom extends Room {
  constructor () {
    super()
    this.maxClients = 2
    this.isGameSet = false
    this.clientId = {}
  }

  onInit (options) {
    MultiplayerRoom.messageLog('Create New room')
    this.game_server = MultiplayerRoom.createNewGame(options.server)
    this.setUpdateGame()
    this.setState(new State())
    // console.log("What is this scene", this.getScene())
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));

  }

  static createNewGame(server) {
    let game_server = new server()
    game_server.setupAuthoritativeServer()
    return game_server
  }

  setUpdateGame () {
    let server = this.game_server
    let gamePromise = server.getGame()
    let self = this
    gamePromise.then((game) => {
      self.game = game
      self.scene = game.scene.scenes[0]
      self.state.updateEnemies(self.scene.enemies.getChildren())
      self.state.updatePlayer(self.clientid, self.scene.scuttle)
      self.state.updateWorld(self.scene)
      if (!self.isGameSet)  {
        self.createEventListeners(self.scene)
        if (Object.keys(this.clientId).length === 2) {
          // self.state.setPlayer(self.scene.scuttle)
          MultiplayerRoom.messageLog("Game is Set")
          self.broadcast('start')
          self.isGameSet = !self.isGameSet
          self.scene.scene.resume()
        }
      }
    }, (err) => {
      console.log("What is the", err)
    })
  }

  createEventListeners(scene) {
    let self = this

    scene.events.on('change_to_hunt', () => {
      self.broadcast('hunt')
    }, self)

    scene.events.on('return_normal', () => {
      self.broadcast('normal')
    }, self)

    scene.events.on('restartGame', () => {
      self.broadcast('restart')
    }, self)

    scene.events.on('send_exit', (enemy) => {
      self.broadcast('enemy_exit'+'_'+enemy.name+enemy.type)
    }, self)

    scene.events.on('eat_player', (player, num) => {
      self.broadcast('eat_player'+'_'+num+'_')
    }, self)

    scene.events.on('eat_enemy', (enemy) => {
      self.broadcast('eat_enemy'+'_'+enemy.name+enemy.type)
    }, self)
  }

  onJoin (client, options) {
    MultiplayerRoom.messageLog("New client join", client.id, client.sessionId)
    // TODO: Make this less dependent
    this.clientId[client.id] = client.id
    console.log("Who are here", this.clientId, Object.keys(this.clientId).length)

    if (Object.keys(this.clientId).length >= 2) {
      this.createNewPlayer(client.id)
    }  else {
      // this.game_server.getScuttle()
      this.state.setPlayer(client.id)
    }
  }

  createNewPlayer(id) {
    console.log("create new player", id)
    let pScene = this.getScene()
    // console.log(pScene.then)
    if (typeof pScene.then === 'function') {
      console.log('scene is a promise!')
        pScene.then((scene) => {
          console.log('scene is a scene now!', scene.initialiseSecond)
          scene.initialiseSecond(id)
        }).catch((err) => {
        console.warn("ERROR?", err)
      })
    } else {
      console.log('a scene is a scene!')
      pScene.initialiseSecond(id)
    }
  }

  getScene() {
    if (typeof this.scene === "undefined") {
      return new Promise((resolve, reject) => {
        let self = this
        let interval = setInterval(()=> {
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

  onLeave (client) {
    console.log("client left")
  }

  onMessage (client, data) {
    //TODO: SET TO ALLOW/HANDLE multiple clients
    console.log("From who", client.sessionId)
    console.log("What is received", data)
    this.scene.scuttle.storeDirectionToMove(data.move)
  }

  update () {
    // if (this.isGameSet) {
      this.setUpdateGame()
    // }
    // this.setEnemyStates(this.scene.enemies)
  }


  static messageLog (...messages) {
    messageLog('Room', messages)
  }

}

serialize(FossilDeltaSerializer)(MultiplayerRoom)