import Phaser from 'phaser'

export default class PauseScreen extends Phaser.Scene {
  constructor () {
    super({key: 'pause'})
  }

  init (data) {
    this.prevScene = data.scene
    this.button = data.button
  }

  create () {
    let width = this.sys.game.config.width
    let height = this.sys.game.config.height

    let menu = this.add.graphics()
      .lineStyle(2, 0x000000, 1)
      .fillStyle(0x123549, 0.9)
      .fillRoundedRect(width * (1 / 4), height * (1 / 4),
        width / 2, height / 2, 10)

    console.log("This is menu", menu)

    let closeScene = () => {
      this.scene.resume(this.prevScene.scene.key)
      this.scene.stop('pause')
    }
    this.createResumeButton(width, height, closeScene)
    this.createSoundSettings(width, height)
    this.createReplay(width, height, closeScene)
    this.input.keyboard.on('keydown_ESC', closeScene)
  }

  createResumeButton (width, height, callback) {
    let resumeButton = this.createButton((width / 4) + 10,
      (height / 4) + 10, 'big')
      .setInteractive()

    this.add.text((width / 4) + 10, (height / 4) + 10, 'Resume')
      .setOrigin(0.5)
      .setFontSize(25)
      .setFontFamily('Fredoka One')

    this.createListeners(resumeButton, callback)
  }

  // Sounds are shared among scenes, just like pictures, animation in the game,
  // so the sound can be adjusted from another scene like this
  createSoundSettings (width, height) {
    let descriptor = this.add.text((width / 4) + 20, (height / 2), 'Volume')
      .setFontSize(25)
      .setOrigin(0, 0.5)
      .setFontFamily('Fredoka One')

    this.volumeSettings = []

    // x and y are temporary for now, not centred
    console.log(this.volumeSettings)
    let x = descriptor.x + descriptor.width + 40
    let y = descriptor.y
    for (let i = 0; i < 4; i++) {
      let button = this.createButton(x, y, 'small').setInteractive()
      this.add.text(x, y, i).setFontSize(25)
        .setFontFamily('Fredoka One')
        .setOrigin(0.5)
      x += 60
      this.volumeSettings.push(button)
    }

    let toChange = this.volumeSettings[this.sound.volume]
    toChange.blendMode = Phaser.BlendModes.ADD
    toChange.isTriggered = true

    for (let i = 0; i < this.volumeSettings.length; i++) {
      let obj = this.volumeSettings[i]
      this.createListeners(obj, () => {
        let original = this.sound.volume
        this.sound.volume = i
        obj.blendMode = Phaser.BlendModes.ADD
        obj.isTriggered = true
        this.volumeSettings[original].blendMode = Phaser.BlendModes.NORMAL
        this.volumeSettings[original].isTriggered = false
      })
    }
  }

  createReplay (width, height, callback) {
    let x = (width * 3 / 4) - 75
    let y = height * 3 / 4 - 45

    let button = this.createButton(x, y, 'big').setInteractive()
    this.add.text(x, y, 'Restart')
      .setOrigin(0.5)
      .setFontFamily('Fredoka One')
    this.createListeners(button, () => {
      this.prevScene.replay()
      callback()
    })
  }

  createListeners (object, callback, context) {
    object.on('pointerover', () => {
      object.blendMode = Phaser.BlendModes.ADD
    })

    object.on('pointerout', () => {
      if (object.isTriggered === undefined || !object.isTriggered) {
        object.blendMode = Phaser.BlendModes.NORMAL
      }
    })

    object.on('pointerup', () => {
      this.button.play()
      if (typeof context === 'undefined') {
        callback()
      } else {
        context.callback()
      }
    })
  }

  checkGameSize () {

  }

  createButton (x, y, size) {
    return this.add.image(x, y, size + 'buttongraphic').setScrollFactor(0)
  }
}
