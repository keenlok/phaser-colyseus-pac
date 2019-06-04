import {HEADLESS, Game} from 'phaser'
import Headless from './scenes/Headless'
import {DEBUG} from '../shared/config/constants'

class GameSinglePlayer extends Headless {
  constructor () {
    super({ key: 'maingame' })
    console.log('GameSinglePlayer')
  }
}

let config = {
  parent: 'game',
  type: HEADLESS,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: DEBUG
    }
  },

  scene: GameSinglePlayer,
  autoFocus: false
}

// eslint-disable-next-line no-unused-vars
let game = new Game(config)

window.game = game
window.gameLoaded()
