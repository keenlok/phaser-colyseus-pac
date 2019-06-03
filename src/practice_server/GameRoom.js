import { Room,  FossilDeltaSerializer, serialize} from 'colyseus'
import { gameServer } from '../practice_server/Server'
import { messageLog } from '../config/constants'

export class GameRoom extends Room {
  constructor () {
    super()
    this.maxClients = 1
  }

  onInit (options) {
    GameRoom.messageLog('Create New room')
    this.createNewGame()
    this.setState({
      players: {},
      enemies: {}
    })
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));

  }

  createNewGame() {
    let game_server = new gameServer()
    game_server.setupAuthoritativeServer()
    this.game_server = game_server
    this.setUpdateGame()
  }

  setUpdateGame () {
    let server = this.game_server
    let gamePromise = server.getGame()
    let self = this
    gamePromise.then((game) => {
      // GameRoom.messageLog("Is promised game undefined", typeof game === 'undefined')
      self.game = game
      self.scene = game.scene.scenes[0]
      // GameRoom.messageLog(game)
      // console.log(game.scene.scenes[0].enemy, game.scene.scenes[0].group)
      // self.state.game = game
      self.setEnemyStates(self.scene.enemies)
    })
  }

  setEnemyStates (enemies) {
    if (typeof enemies === "undefined") {
      return
    }
    // GameRoom.messageLog("Setting/Updating enemy states")
    enemies.children.iterate(enemy => {
      // GameRoom.messageLog(enemy.name, enemy.type, enemy.x, enemy.y)
      this.state.enemies[enemy.name+enemy.type] = {
        x:        enemy.x,
        y:        enemy.y,
        mode:     enemy.mode,
        isFright: enemy.isFrightened,
        isDead:   enemy.isDead
      }
    })

  }


  onJoin (client) {
    GameRoom.messageLog("New client join", client.id)
  }

  onLeave (client) {
    console.log("client left")
  }

  onMessage (client, data) {

  }

  update () {
    this.setUpdateGame()
    // this.setEnemyStates(this.scene.enemies)
  }


  static messageLog (...messages) {
    messageLog('Room', messages)
  }

}

serialize(FossilDeltaSerializer)(GameRoom)