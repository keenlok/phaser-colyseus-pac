import { Room,  FossilDeltaSerializer, serialize} from 'colyseus'
import { messageLog, DEBUG } from '../shared/config/constants'
import { State } from "./states/objectStates"

export class GameRoom extends Room {
  constructor () {
    super()
    this.maxClients = 1
    this.isGameSet = false
  }

  onInit (options) {
    GameRoom.messageLog('Create New room')
    this.game_server = GameRoom.createNewGame(options.server)
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
      if (!self.isGameSet)  {
        // self.state.setPlayer(self.scene.scuttle)
        GameRoom.messageLog("Game is Set")
        self.broadcast('start')
        self.isGameSet = !self.isGameSet
      }
    }, (err) => {
      console.log("What is the", err)
    })
  }

  onJoin (client, options) {
    GameRoom.messageLog("New client join", client.id)
    // TODO: Make this less dependent
    this.clientid = client.id
    // this.game_server.getScuttle()
    this.state.setPlayer(client.id)
  }

  onLeave (client) {
    console.log("client left")
  }

  onMessage (client, data) {
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

serialize(FossilDeltaSerializer)(GameRoom)