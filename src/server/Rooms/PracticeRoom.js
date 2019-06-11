import { Room,  FossilDeltaSerializer, serialize} from 'colyseus'
import { messageLog, DEBUG } from '../../shared/config/constants'
import { State } from "../states/objectStates"

export class PracticeRoom extends Room {
  constructor () {
    super()
    this.maxClients = 1
    this.isGameSet = false
    this.clientId = {}
  }

  onInit (options) {
    PracticeRoom.messageLog('Create New room')
    this.game_server = PracticeRoom.createNewGame(options.server)
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
      // self.state.updatePlayer(self.clientid, self.scene.scuttle)
      self.state.updateWorld(self.scene)
      if (!self.isGameSet)  {
        self.createEventListeners(self.scene)
        // self.state.setPlayer(self.scene.scuttle)
        PracticeRoom.messageLog("Game is Set")
        self.broadcast('start')
        console.log("Resume!")
        self.isGameSet = !self.isGameSet
        self.scene.scene.resume()
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

    scene.events.on('player_created', (player) => {
      scene.restartGame(player)
    })
  }

  onJoin (client, options) {
    PracticeRoom.messageLog("New client join", client.id)
    // TODO: Make this less dependent
    this.clientId[client.id] = client.id
    console.log("Who are here", this.clientId, Object.keys(this.clientId).length)
    this.game_server.createNewPlayers(client.id)
    // this.state.setPlayer(client.id)
    // this.setPlayer(client.id)
  }


  onLeave (client) {
    console.log("client left", client.sessionId)
  }

  onMessage (client, data) {
    //TODO: SET TO ALLOW/HANDLE multiple clients
    // console.log("From who", client.sessionId)
    // console.log("What is received", data)
    this.scene.scuttle.storeDirectionToMove(data.move)
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

serialize(FossilDeltaSerializer)(PracticeRoom)
