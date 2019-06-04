import * as levelData from '../leveldata/NewLevelData'
import { messageLog as log } from '../config/constants'
import Phaser from 'phaser'

let messageLog = (...messages) => {
  const name = "GameObjectFactory"
  log(name, messages)
}

export default {
  messageLog,

  createMap(scene) {
    messageLog('Creating map')

    scene.image = scene.add.image(0, 0, 'background')
    scene.image.setScale(3.5)
    scene.map = scene.make.tilemap({key: 'newmap'})

    // If did not specify margin and spacing in Tiled use scene line:
    // scene.tileset = scene.map.addTilesetImage('FinalTiles(v1)-small', 'tile', 80, 80, 1, 2)
    // Else no need to indicate

    // Tile Layer
    scene.tileset = scene.map.addTilesetImage('final-extruded-again', 'tile', 80, 80)
    scene.tileLayer = scene.map.createDynamicLayer('Tile Layer 1', scene.tileset, 0, 0)
    // Coral Layer
    scene.coral = scene.map.addTilesetImage('coral-small-v1', 'coral')
    scene.coralLayer = scene.map.createStaticLayer('Tree', scene.coral, 0, 0)
    // Food Layer
    scene.food = scene.map.addTilesetImage('Food', 'foodTile')
    scene.foodLayer = scene.map.createDynamicLayer('Food', scene.food, 0, 0)
  },

  createCursors(scene) {
    messageLog("Create cursors for input")
    scene.cursors = scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE') // can only be
  },

  createAndConfigureCameras(scene) {
    // This enables camera to zoom in on scuttle and follow him
    // scene.checkGameSize() // can handle sizes larger than the game map
    scene.cameras.main.setBounds(0, 0, levelData.WIDTH, levelData.HEIGHT)
    scene.cameras.main.startFollow(scene.scuttle, true, 0.1, 0.1)
    scene.cameras.main.roundPixels = true
    let stuff = scene.cameras.main
    messageLog("Initialise World View:", stuff.worldView, stuff.width, stuff.height,
      stuff.displayHeight, stuff.displayWidth)
    scene.cameraView = stuff.worldView
  },

  createPauseButton(scene) {
    messageLog("Create pause button")
    createButtonsGraphics(scene)

    // For some reason, a graphic can't listen to these events.....
    scene.pauseButton = scene.add.image(0, 0, 'pause')
      .setScrollFactor(0)
      .setOrigin(0)

    scene.pauseButton.setInteractive()
    console.log(scene.pauseButton.eventNames())

    scene.pauseButton.on('pointerover', () => {
      scene.pauseButton.blendMode = Phaser.BlendModes.ADD
      // gameObject.blendMode = Phaser.BlendModes.ADD
    })

    scene.pauseButton.on('pointerout', () => {
      // console.log('out', pointer, gameObject)
      scene.pauseButton.blendMode = Phaser.BlendModes.NORMAL
    })

    scene.pauseButton.on('pointerup', scene.launchPauseScreen, scene)

    scene.input.keyboard.on('keydown_ESC', scene.launchPauseScreen, scene)

    console.log(scene.pauseButton.eventNames())
    console.log("")
  },

  createButtonsGraphics(scene) {
    let x = scene.scoreText.x
    let y = scene.scoreText.height

    let pauseButton = scene.add.graphics()
      .fillStyle(0x1e1e1e, 1)
      .fillRoundedRect(0, 0, x - 5, y, {tl: 0, tr: 0, br: 10, bl: 0})
      .fillStyle(0xffbc06, 1)
      .fillRoundedRect(0, 0, x - 10, y - 5, {tl: 0, tr: 0, br: 10, bl: 0})
      .fillStyle(0x1e1e1e, 1) // For the 2 stripes
      .fillRect(15, 4, 5, y - 13)
      .fillStyle(0x1e1e1e, 1)
      .fillRect(25, 4, 5, y - 13)
      .setScrollFactor(0)

    pauseButton.generateTexture('pause', x, y)
    pauseButton.destroy()

    let bigButtonGraphic = scene.add.graphics()
      .fillStyle(0xffbc06, 1)
      .fillRect(0, 0, 120, 50) // RoundedRect is kinda buggy

    bigButtonGraphic.generateTexture('bigbuttongraphic', 120, 50)
    bigButtonGraphic.destroy()

    let smallButton = scene.add.graphics()
      .fillStyle(0xffbc06, 1)
      .fillRect(0, 0, 50, 50)

    smallButton.generateTexture('smallbuttongraphic', 50, 50)
    smallButton.destroy()
  },

  createMiniMap(scene) {
    let x = scene.sys.game.config.width
    let y = scene.sys.game.config.height
    console.log(x, y)
    let zoomFactor = 0.3
    let width = levelData.WIDTH * zoomFactor
    let height = levelData.HEIGHT * zoomFactor

    // scene.miniMap = scene.cameras.add(0, y - height, width, height, false, 'minimap')
    scene.miniMap = scene.cameras.add(0, y - height, width, height, false, 'minimap')
      .setZoom(zoomFactor)
      .setBounds(0, 0, levelData.WIDTH, levelData.HEIGHT, true)
      .startFollow(scene.scuttle)
      // .ignore([scene.scoreText, scene.liveText, scene.pauseButton])
    scene.miniMap.setAlpha(0.95)
  },

  createScoreAndText(scene) {
    messageLog("create score text")
    scene.scoreText = scene.add.text(60, 0, scene.scoreString + scene.score)
      .setScrollFactor(0)
      .setFontFamily('Fredoka One')
      .setFontSize(25)
    scene.liveText = scene.add.text(370, 0, scene.liveString + scene.scuttle.lives)
      .setScrollFactor(0)
      .setFontFamily('Fredoka One')
  },
}


// export default GameObjFactory
