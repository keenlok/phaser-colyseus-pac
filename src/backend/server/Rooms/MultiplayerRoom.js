import { Room,  FossilDeltaSerializer, serialize} from 'colyseus'
import { messageLog, DEBUG } from '../../../shared/config/constants'
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
    this.setListeners()
    this.setUpdateGame()
    this.setState(new State())
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));

  }

  static createNewGame(server) {
    let game_server = new server()
    game_server.setupAuthoritativeServer()
    return game_server
  }

  setListeners() {
    let self = this
    let server = this.game_server
    let promise = server.getScene()
    if (typeof promise.then === 'function') {
      console.log('scene is a promise!')
      promise.then((scene) => {
        console.log('scene is a scene now!')
        self.createEventListeners(scene)
      }).catch((err) => {
        console.warn("ERROR?", err)
      })
    } else {
      console.log('a scene is a scene!')
      self.createEventListeners(promise)
    }
  }


  setUpdateGame () {
    let server = this.game_server
    let gamePromise = server.getGame()
    let self = this
    gamePromise.then((game) => {
      self.game = game
      self.scene = game.scene.scenes[0]
      self.state.updateEnemies(self.scene.enemies.getChildren())
      self.state.updatePlayers(self.scene.players)
      // self.state.updatePlayer(self.clientid, self.scene.scuttle)
      self.state.updateWorld(self.scene)
      if (!self.isGameSet)  {
        // self.createEventListeners(self.scene)
        if (Object.keys(this.clientId).length === 2) {
          // self.state.setPlayer(self.scene.scuttle)
          MultiplayerRoom.messageLog("Game is Set")
          self.broadcast('start')
          self.isGameSet = true
          console.log("Resume!")
          self.scene.scene.resume()
        }
      }
    }).catch((err) => {
      console.log("What is the", err)
    })
  }

  createEventListeners(scene) {
    let self = this

    scene.events.on('player_created', (player) => {
      self.state.setPlayer(player.id, player)
      console.log("Player is created", player.id)
      scene.setTarget()
      // scene.restartGame(player)
    }, self)

    scene.events.on('change_to_hunt', (player) => {
      self.broadcast('hunt_'+player.id)
    }, self)

    scene.events.on('return_normal', () => {
      self.broadcast('normal')
    }, self)

    scene.events.on('restartGame', (player) => {
      self.broadcast('restart_'+player.id)
    }, self)

    scene.events.on('send_exit', (enemy) => {
      self.broadcast('enemy_exit'+'_'+enemy.name+enemy.type)
    }, self)

    scene.events.on('eat_player', (player, num) => {
      self.broadcast('eat_player'+'_'+num+'_'+player.id)
    }, self)

    scene.events.on('eat_enemy', (enemy, player) => {
      self.broadcast('eat_enemy_'+enemy.name+enemy.type+'_'+player.id)
    }, self)

    MultiplayerRoom.messageLog("Event listeners created!")
  }


  onJoin (client, options) {
    MultiplayerRoom.messageLog("New client join", client.id)
    this.clientId[client.id] = client.id
    console.log("Who are here", this.clientId, Object.keys(this.clientId).length)
    this.game_server.createNewPlayers(client.id)
  }

  onLeave (client) {
    console.log("client left", client.id)
    // this.game.destroy()
  }

  onMessage (client, data) {
    let id = client.id
    // console.log("From who", id)
    // console.log("What is received", data)
      if (typeof data === 'string' && data === 'client_player_created') {
        console.log("How many players are there?", Object.keys(this.scene.players).length)
        if (Object.keys(this.scene.players).length === 2) {
          this.scene.restartGame(this.scene.players[id])
          this.isGameSet = true
        }
      } else {
        if (this.isGameSet) {
          this.scene.players[id].storeDirectionToMove(data.move)
        }
      }

  }

  onDispose() {
    console.log("Clean up time")
    this.game_server.dispose()
  }

  update () {
    if (this.isGameSet) {
      this.setUpdateGame()
    }
    // this.setEnemyStates(this.scene.enemies)
  }


  static messageLog (...messages) {
    messageLog('Room', messages)
  }

}

serialize(FossilDeltaSerializer)(MultiplayerRoom)
