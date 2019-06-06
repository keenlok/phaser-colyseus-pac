import Phaser from 'phaser'

export default class Menu extends Phaser.Scene {
  constructor () {
    super({key: 'preload_screen'})
  }

  preload () {
    this.load.image('button', '/static/assets/tileV1.png')
  }

  create () {
    this.createBox(this.sys.game.config.width / 4, this.sys.game.config.height / 4)
  }

  createBox (x, y) {
    // let width = 200
    // let height = 100

    // let button =
    this.add.image(x, y, 'button').setInteractive()
    // let test =
    this.add.text(x + 40, y, 'Start').setInteractive()
    this.input.on('gameobjectup', this.handleClick, this)
  }

  handleClick () {
    console.log('hi')
    this.scene.start('maingame')
  }
}
