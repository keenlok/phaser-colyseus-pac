import Phaser from 'phaser'

export default class Menu extends Phaser.Scene {
  constructor () {
    super({key: 'preload_screen'})
  }

  preload () {
    this.load.image('button', '/static/assets/loading-pop.gif')
  }

  create () {
    this.createBox(this.sys.game.config.width, this.sys.game.config.height)
  }

  createBox (sysX, sysY) {
    // let width = 200
    // let height = 100

    // let button =
    console.log("Here!")
    let cX = sysX / 2
    let y = sysY / 4
    let logo = this.add.image(cX - 40, y, 'button')
    // let test =
    // let x = sysX / 2
    let cY = sysY / 2
    let practice = this.add.text(cX - 40, cY, 'Practice').setInteractive()

    practice.on('pointerup', () => {
      this.scene.start('maingame', {room: 'practice'})
    })

    let multiplayer = this.add.text(cX - 40, cY + 40, '2 Player').setInteractive()

    multiplayer.on('pointerup', () => {
      this.scene.start('maingame', {room: '2player'})
    })
    // this.input.on('gameobjectup', this.handleClick, this)
  }

  handleClick () {
    console.log('hi')
    this.scene.start('maingame')
  }
}
