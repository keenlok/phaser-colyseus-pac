import Phaser from 'phaser'
import {DEBUG} from '../../shared/config/constants'

export default class GameOver extends Phaser.Scene {
  constructor () {
    super({key: 'gameover'})
  }

  init (data) {
    console.log('hello', data)
    this.lives = data.lives
    this.score = data.score
    this.prevScene = data.prevScene
    this.button = data.button
    this.type = data.type
    this.normalBGM = data.bgm
    this.isAlpha = data.isAlpha
  }

  create () {
    this.modal = document.getElementById('mymodal')
    this.modal.className = this.modal.className + ' is-active'
    this.createUI()
  }

  scaleImage (width, height) {
    let scale
    if (this.screen.width > width) {
      scale = (width / this.screen.width) * 0.8
    } else if (this.screen.height > height) {
      scale = (height / this.screen.width) * 0.8
    } else {
      scale = 0.8
    }

    return scale
  }

  createUI () {
    let text = document.getElementById('descriptor')
    let crab = document.getElementById('crab-img')
    console.log('did it fail here')
    crab.src = '../static/assets/menus/crab.png'
    if (!this.isAlpha) {
      if (this.type === 'win') {
        text.innerHTML = 'YOU WIN!'
        crab.src = '../static/assets/menus/crab.png'
      } else if (this.type === 'lose') {
        text.innerHTML = 'GAME OVER!'
        crab.src = '../static/assets/menus/dead_crab.png'
      }
    } else {
      text.innerHTML = 'Thank You for playing'
    }

    let playAgainCallback = () => {
      this.prevScene.replay()
      this.scene.resume(this.prevScene.scene.key)
      this.button.play()
      this.scene.stop('gameover')
      this.modal.className = 'modal'
    }

    /* html implentation */
    let playAgain = document.getElementById('playagain')
    playAgain.onclick = playAgainCallback

    let feedback = document.getElementById('feedback')
    feedback.onclick = () => {
      this.button.play()
      this.openExternalLink()
    }

    console.log('did it fail here')

    // The code below is for cross image
    // imageX = x + this.screen.displayWidth / 2
    // let imageY = y - this.screen.displayHeight / 2
    // let closeButton = this.add.image(imageX, imageY, 'quit_light')
    //   .setScale(this.scale)
    //   .setOrigin(0.5)
    //   .setInteractive()
    //
    // this.listenersAndCallback(closeButton, () => {
    //   close()
    // }, () => {
    //   closeButton.setTexture('quit_dark')
    // }, () => {
    //   closeButton.setTexture('quit_light')
    // })
  }

  openExternalLink () {
    if (!DEBUG) {
      let url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      window.open(url, '_self')
    } else {
      window.location.href = '/feedback'
      console.log('feedback')
    }
  }

  checkGameSize () {
    if (typeof this.image !== 'undefined') {
      let currWidth = this.sys.game.config.width
      let currHeight = this.sys.game.config.height
      let view = this.cameras.main.worldView
      if (view.width !== currWidth ||
        view.height !== currHeight) {
        this.cameras.main.setSize(currWidth, currHeight)
        this.handleSizeChange(currWidth, currHeight)
      }
    }
  }

  handleSizeChange (width, height) {
    this.scale = this.scaleImage(width, height)
    this.screen.setScale(this.scale)
    this.screen.setPosition(width / 2, height / 2)
  }
}
