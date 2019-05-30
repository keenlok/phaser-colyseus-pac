import Phaser from 'phaser'
// import Boot from '../Boot'
// import Preload from '../Preload'
import ExtendedGame from '../ExtendedGame'
// import Menu from '../Menu'
// import GameOver from '../GameOver'
// import PauseScreen from '../PauseScreen'
import * as constants from '../config/constants'
// const SoundFadePlugin from 'phaser3-rex-plugins/plugins/soundfade-plugin')

// window.gameLoaded = () => { console.log("NOT OVERWRITTEN")}

class GameSinglePlayer extends ExtendedGame {
  constructor () {
    super({ key: 'maingame' })
    // super.initializeVariables()
    console.log('GameSinglePlayer')
  }

  update (time) {
    super.update(time)
    // let cam = this.cameras.main
    // cam.scrollX = this.scuttle.x - 500
    // cam.scrollY = this.scuttle.y - 500
    // console.log("this camera ", this.cameras.main.scrollX, this.cameras.main.scrollY)
  }
}

console.log('DEBUG is', constants.DEBUG)

let config = {
  parent: 'game',
  type: Phaser.HEADLESS,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: constants.DEBUG
    }
  },

  scene: GameSinglePlayer,
  autoFocus: false
}

// console.log("Config is defined!", config)
// eslint-disable-next-line no-unused-vars
let game = new Phaser.Game(config)

window.gameLoaded()
