import { Room } from 'colyseus'
import { gameServer } from '../practice_server/Server'

export class GameRoom extends Room {
  constructor () {
    super()
    this.maxClients = 1
  }

  onInit (options) {
    console.log('init')
    let game_server = new gameServer()
    game_server.setupAuthoritativeServer()
    this.game_server = game_server
  }

  onJoin (client) {
    console.log("New client join", client.id)
    while(typeof this.game_server.game === 'undefined') {}
    this.game = this.game_server.game
    console.log("Is game undefined", typeof this.game === 'undefined')

  }

  onLeave (client) {
    console.log("client left")
  }

  onMessage (client, data) {

  }

}