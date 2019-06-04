import { Room,  FossilDeltaSerializer, serialize} from 'colyseus'
import { gameServer } from '../practice_server/Server'
import { messageLog, DEBUG } from '../shared/config/constants'

export class GameRoom extends Room {
  constructor () {
    super()
    this.maxClients = 1
    this.isGameSet = false
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
      self.game = game
      self.scene = game.scene.scenes[0]
      // GameRoom.messageLog(game)
      // console.log(game.scene.scenes[0].enemy, game.scene.scenes[0].group)
      // self.state.game = game
      self.setEnemyStates(self.scene.enemies.getChildren())
      if (!self.isGameSet)  {
        // self.setPlayerState(self.scene.scuttle)
        GameRoom.messageLog("Game is Set")
        self.broadcast('start')
        self.isGameSet = !self.isGameSet
      }
    })
  }

  setEnemyStates (enemies) {
    if (typeof enemies === "undefined") {
      return
    }
    // GameRoom.messageLog("Setting/Updating enemy states")
    enemies.then((children) => {
      children.iterate(enemy => {
        // GameRoom.messageLog(enemy.name, enemy.type, enemy.x, enemy.y)
        this.state.enemies[enemy.name + enemy.type] = {
          x: enemy.x,
          y: enemy.y,
          mode: enemy.mode,
          isFright: enemy.isFrightened,
          isDead: enemy.isDead,
          dest: enemy.ghostDestination
        }
      })
    })
  }

  setPlayerState (id, player) {
    if (typeof player === "undefined") {
      if (typeof this.scene === "undefined") {
        return
      } else {
        player = this.scene.scuttle
      }
    }
    this.state.players[this.scene.scuttle.name+id] = {
      x:        player.x,
      y:        player.y,
      currDir:  player.currentDir,
      alive:    player.alive,
      isDead:   player.isDead,
      isPowUp:  player.isPowerUp,
      lives:    player.lives
    }

  }

  onJoin (client) {
    GameRoom.messageLog("New client join", client.id)
    this.setPlayerState(client.id)
  }

  onLeave (client) {
    console.log("client left")
  }

  onMessage (client, data) {

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