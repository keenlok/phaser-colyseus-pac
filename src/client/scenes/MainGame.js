import * as constants from '../../shared/config/constants'
import * as levelData from '../../shared/leveldata/NewLevelData'
import Phaser from 'phaser'
import * as GameObjectFactory from '../gameObjectFactory'
import PhysicsFactory from '../../shared/factory/PhysicsFactory'
import AnimationFactory from '../../shared/factory/AnimationFactory'
import SoundFactory from '../../shared/factory/SoundFactory'
import ScoreManager from '../../shared/manager/ScoreManager'

class MainGame extends Phaser.Scene {
  constructor () {
    super({ key: 'maingame' })
    this.isTwoPlayer = false
    this.initializeVariables()
  }

  initializeVariables () {
    // map and tiles
    this.map = null
    this.scuttle = null
    this.cursors = null
    // scores
    this.score = 0
    this.scoreText = null
    this.scoreString = 'Score: '
    // lives
    this.liveText = null
    this.liveString = 'Lives: '
    this.powerUp = false
    this.specialFood = null
    this.group = null
    this.numFoodEaten = 0

    this.SPECIAL_TILES = [
      { x: 0, y: 0 }
      // { x: 17, y: 12 },
      // { x: 13, y: 20 }
      // { x: 23, y: 22 }
    ] // original : x 13 , 15 , y : 11 , something

    this.TIME_MODES = [
      {
        mode: 'scatter',
        time: 14000
      },
      {
        mode: 'chase',
        time: 40000
      },
      {
        mode: 'scatter',
        time: 14000
      },
      {
        mode: 'chase',
        time: 40000
      },
      {
        mode: 'scatter',
        time: 10000
      },
      {
        mode: 'chase',
        time: 40000
      },
      {
        mode: 'scatter',
        time: 10000
      },
      {
        mode: 'chase',
        time: -1 // -1 = infinite
      }
    ]
    this.changeModeTimer = 0
    this.remainingTime = 0
    this.currentMode = 0
    this.FRIGHTENED_MODE_TIME = 24000
    this.isHuntMode = false
    this.enemy = null
    this.isRepeating = false

    this.isPinkOut = false
    this.isBlueOut = false
    this.isOrangeOut = false

    this.isPaused = true
    this.tileFlag = false

    this.isFirstPlayer = true
  }

  init (data) {
    if (typeof data.menu !== 'undefined') {
      console.log(data)
      this.scene.stop(data.menu.key)
    }
  }

  create () {
    AnimationFactory.createAllAnimations(this.anims)

    // This object will manage all the sounds including playing then
    this.soundManager = SoundFactory.createAllAudio(this, this.sound)

    GameObjectFactory.createAllGameObjects(this)

    this.physicsFactory = new PhysicsFactory(this, this.physics)
    this.physicsFactory.setupPhysicsForRelevantObjects(this.scuttle, this.enemies.getChildren(), this.specialFood.children)

    this.scoreManager = new ScoreManager(this)

    this.soundManager.playNormalBgm('loop', {delay: 0})

    // For touch input
    this.input.on('pointerup', this.endSwipe, this)

    if (constants.DEBUG) {
      // this.createDebug()
      GameObjectFactory.createMiniMap(this)
      // this.createLights()
      // this.createCheats()
    }

    this.scene.pause()

    this.restartGame()
    this.enemyTarget = this.scuttle
  }

  // Help with debug
  createCheats () {
    let message = 'DEBUG TRUE'
    let message1 = this.add.text(0, this.scoreText.height + 2, message)
      .setScrollFactor(0)
      .setFontSize(20)
      .setTint(0xFF4500)
    this.miniMap.ignore(message1)

    let messages = [
      'Press U to increase the speed of the game',
      'Press N to return to normal speed',
      'Press L to show Lose/Game over screen',
      'Press P to show Win Screen',
      'Press T to show Thank You Screen'
    ]
    let y = message1.height + message1.y + 2
    for (let i = 0; i < messages.length; i++) {
      let text = this.add.text(0, y, messages[i])
        .setScrollFactor(0)
        .setFontSize(16)
      y = text.y + text.height + 2
      this.miniMap.ignore(text)
    }

    this.input.keyboard.on('keydown_U', () => {
      if (this.scuttle.speed < 600) {
        this.scuttle.increaseSpeed()
        this.enemies.increaseSpeed()
      }
      console.log('Base Speed increased to:', this.scuttle.speed)
    }, this)

    this.input.keyboard.on('keydown_N', () => {
      this.scuttle.baseSpeed()
      this.scuttle.move(this.scuttle.currentDir)
      this.enemies.baseSpeed()
      console.log('Base Speed returned to:', this.scuttle.speed)
    }, this)

    this.input.keyboard.on('keydown_L', () => {
      console.log('lose')
      this.gameOver('lose')
    }, this)
    this.input.keyboard.on('keydown_P', () => {
      console.log('win')
      this.gameOver('win')
    }, this)
    this.input.keyboard.on('keydown_T', () => {
      console.log('thanks for playing')
      this.gameOver('thanks')
    }, this)

    this.optionFlag = true
    this.input.keyboard.on('keydown_Q', () => {
      this.optionFlag = !this.optionFlag
    }, this)

    // menu.destroy()
  }

  resetTimer () {
    console.log(this.time.now, this.SFXTimer, this.changeModeTimer)
    this.scuttle.testTimer = this.time.now
    this.soundManager.resetTimer(this.time.now)
    this.changeModeTimer = this.time.now + this.TIME_MODES[this.currentMode].time
  }

  // TODO: Check if this moves player 1 if user is player 2 during multiplayer match
  endSwipe (event) {
    // Variables used for dragging in phaser
    let swipeTime = event.upTime - event.downTime
    let swipe = new Phaser.Geom.Point(event.upX - event.downX, event.upY - event.downY)
    let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe)
    let swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude)

    if (swipeMagnitude > 20 && swipeTime < 1000 &&
      (Math.abs(swipeNormal.x) > 0.8 || Math.abs(swipeNormal.y) > 0.8)) {
      if (swipeNormal.x > 0.8) {
        this.checkMoves(constants.RIGHT)
        console.log('swiping right')
      }
      if (swipeNormal.x < -0.8) {
        this.checkMoves(constants.LEFT)
        console.log('swiping left')
      }
      if (swipeNormal.y > 0.8) {
        this.checkMoves(constants.DOWN)
        console.log('swiping down')
      }
      if (swipeNormal.y < -0.8) {
        this.checkMoves(constants.UP)
        console.log('swiping up')
      }
    }
  }

  checkMoves (direction) {
    if (this.scuttle.lives >= 0) {
      this.scuttle.gestureControl(direction)
    }
  }

  setupCollidersForPlayer (player) {
    // console.log('using new method')
    this.physicsFactory.setupPhysicsForPlayer(player, this.enemies.children, this.specialFood.children)
  }

  // ------------------------------------ Methods for Enemies -------------------------------------//

  checkEnemiesBehaviour (time) {
    if (!this.isPinkOut) {
      // console.log('hello?')
      // this.sendExitOrder(this.enemies.enemy)
      // console.log(this.enemies.enemy3)
      this.isPinkOut = true
    }
    // if (numFood - this.numFoodEaten < 300 && !this.isOrangeOut) {
    if (this.numFoodEaten / levelData.numFood > 0.75 && !this.isOrangeOut) {
      this.sendExitOrder(this.enemies.enemy2)
      this.isOrangeOut = true
    }
    if (this.numFoodEaten > levelData.numFood / 3 && !this.isBlueOut) {
      this.sendExitOrder(this.enemies.enemy1)
      this.isBlueOut = true
    }
    if (!this.isRepeating || this.isHuntMode) {
      if (this.isHuntMode && this.changeModeTimer <= time + 7000) {
        this.enemies.transitionEnemiesToNormal(this.tileFlag)
      }

      if (this.changeModeTimer !== -1 && !this.isHuntMode && this.changeModeTimer < time) {
        this.currentMode++
        this.changeModeTimer = time + this.TIME_MODES[this.currentMode].time
        if (this.TIME_MODES[this.currentMode].mode === 'chase') {
          this.sendAttackOrder()
        } else {
          this.sendScatterOrder()
        }
        this.logCurrentMode()
      }
      if (this.isHuntMode && this.changeModeTimer < time) {
        this.changeModeTimer = time + this.remainingTime
        this.isHuntMode = false
        this.returnToNormal()
        if (this.TIME_MODES[this.currentMode].mode === 'chase') {
          this.sendAttackOrder()
        } else {
          this.sendScatterOrder()
        }
        this.logCurrentMode()
      }
      if (this.TIME_MODES[this.currentMode].time === -1) {
        this.isRepeating = true
      }
    }
  }

  logCurrentMode () {
    console.log('new mode:', this.TIME_MODES[this.currentMode].mode, this.TIME_MODES[this.currentMode].time)
    this.events.emit('changeMode')
  }

  giveExitOrder (enemy) {
    let remainingTime = this.changeModeTimer - this.time.now
    // Delay enemy exit until the powerup mode is over
    // console.log('did i send something', enemy)
    this.time.delayedCall(remainingTime + (Math.random() * 3000), this.sendExitOrder, [enemy], this)
  }

  updateEnemies (time) {
    this.enemies.update(time)
  }

  sendAttackOrder () {
    this.enemies.attack()
  }

  sendExitOrder (ghost) {
    // console.log(enemy)
    // enemy.mode = this.enemy.EXIT_HOME
    ghost.egg.anims.delayedPlay(1, 'enemy_spawn')
  }

  sendScatterOrder () {
    this.enemies.scatter()
  }

  isSpecialTile (tile) {
    for (let i = 0; i < this.SPECIAL_TILES.length; i++) {
      if (tile.x === this.SPECIAL_TILES[i].x && tile.y === this.SPECIAL_TILES[i].y) {
        return true
      }
    }
    return false
  }

  resetEnemies () {
    this.enemies.resetEnemies()
    this.sendExitOrder(this.enemies.enemy3)
    this.sendExitOrder(this.enemies.enemy)
    this.currentMode = 0
    this.isPinkOut = false
    this.isBlueOut = false
    this.isOrangeOut = false
  }

  // ------------------------------------ Methods for Players -------------------------------------//
  updatePlayer () {
    // this.scuttle.control(this.cursors)
    // this.followScuttle(this.scuttle)
    if (this.scuttle.body.speed > 0) {
      this.soundManager.playScuttleSFX(this.time.now)
    }
  }

  // --------------------------------------- For The Game -----------------------------------------//

  getCurrentMode () {
    if (!this.isHuntMode) {
      if (this.TIME_MODES[this.currentMode].mode === 'scatter') {
        return 'scatter'
      } else {
        return 'chase'
      }
    } else {
      return 'random'
    }
  }

  update (time) {
    if (!this.isPaused) {
      this.checkTimer()
      if (!this.scuttle.isDead || !this.isRepeating) {
        this.checkEnemiesBehaviour(time)
      }
      this.updatePlayer()
      // this.updateEnemies(time)
    }
    this.checkScoreToEndGame()
    // this.checkGameSize()
  }

  animateTile (type) {
    if (type) {
      this.foodLayer.replaceByIndex(166, 167)
    } else {
      this.foodLayer.replaceByIndex(167, 166)
    }
    // console.log('is anything happening')
  }

  checkTimer () {
    if (this.timerIsInvalid(this.changeModeTimer)) {
      console.log(this.changeModeTimer, this.time.now)
      this.resetTimer()
      // If the timer isnt started, the game wont enter the other modes
    }
  }

  timerIsInvalid (timer) {
    return timer === 0 || timer > Math.pow(10, 12)
  }

  returnToNormal () {
    this.soundManager.doTransitionToNormalFromHunt()
    this.enemies.returnToNormal()
    this.scuttle.returnToNormal()
    this.count = 0
  }

  changeToHuntMode (player) {
    this.soundManager.eatSpecialSfx.play()
    // This should prevent the game from triggering hunt mode when the game is won
    if (!this.checkScoreToEndGame()) {
      this.enemies.becomeScared()
      if (!this.isHuntMode) {
        this.remainingTime = this.changeModeTimer - this.time.now
        this.soundManager.doTransitionToHuntFromNormal()
      }
      this.changeModeTimer = this.time.now + this.FRIGHTENED_MODE_TIME
      this.isHuntMode = true
      player.powerUp()
      console.log('Hunt Mode remaining time:', this.remainingTime)
    }
  }

  restartGame (args) {
    let player
    console.log(args === this.scuttle)
    if (typeof args === 'undefined') {
      player = this.scuttle
    } else {
      player = args
    }
    console.log('Player has died, Restarting Game', player)
    this.liveText.setText(this.liveString + player.lives)
    this.currentMode = 0
    this.isHuntMode = false
    player.returnToNormal()
    if (player.lives > 0) {
      player.respawn()
      this.isPaused = false
      // This makes sure that the enemies doesn't always respawn when scuttle dies
      // if (player.lives === 3) {
      //   this.resetEnemies()
      // }
      this.isRepeating = false
      this.changeModeTimer = this.time.now + this.TIME_MODES[this.currentMode].time
      this.count = 0
    } else {
      this.gameOver('lose')
    }
  }

  getTileAtMap (x, y) {
    let tile = this.tileLayer.getTileAt(x, y, true)
    if (tile !== null && tile.index === -1) {
      return this.coralLayer.getTileAt(x, y, true)
    } else {
      return tile
    }
  }

  // This is the process callback for the collision of two objects
  // it only triggers to be true if the 2 game objects overlap by half
  // the number can be changed
  isOverlapping (obj1, obj2) {
    if (Phaser.Math.Fuzzy.Equal(obj1.x, obj2.x, 40) &&
      Phaser.Math.Fuzzy.Equal(obj1.y, obj2.y, 30)) {
      let num = Math.round(Math.random() * 2) + 1
      obj1.eatAudio = num
      obj2.eatAudio = num
      return true
    }
    return false
  }

  launchPauseScreen () {
    // this.scene.launch('pause')
    // this.scene.pause()
    this.soundManager.playButtonSoundEffect()
    this.scene.pause()
    this.scene.launch('pause', {
      scene: this,
      button: this.soundManager.buttonSfx
    })
  }

  // The scuttle eats food that are visible. Eating the food will turn it
  // invisible, and increase the score.
  eatFood (player, tile) {
    if (tile.visible) {
      this.soundManager.playEatFoodEffect()
      tile.setVisible(false)
      // this.increaseScore('normalfood', player)
      this.numFoodEaten++
    }
  }

  eatBiggerCoin (player, coin) {
    if (coin.visible) {
      // this.increaseScore('specialfood', player)
      this.numFoodEaten++
      coin.setVisible(false)
      this.changeToHuntMode(player)
    }
  }

  /**
   * This function makes sure that scuttle can only eat the food if the
   * center of scuttle is at the center of the food tile.
   *
   * @param player The player game object
   * @param tile The tile that scuttle is overlapped with
   * @returns {boolean} A boolean flag for the physics overlap function to
   * trigger the callback function
   */
  canPlayerEat (player, tile) {
    if (tile !== null) {
      let isFood = false
      for (let i = 0; i < levelData.FoodTiles.length; i++) {
        if (tile.index === levelData.FoodTiles[i]) {
          isFood = true
          break
        }
      }
      if (isFood) {
        let cx = tile.x * constants.TileSize + constants.CenterOffset
        let cy = tile.y * constants.TileSize + constants.CenterOffset
        if (Phaser.Math.Fuzzy.Equal(player.x, cx, player.threshold) &&
        Phaser.Math.Fuzzy.Equal(player.y, cy, player.threshold)) {
          return true
        }
      }
    }
  }

  increaseScore (key, player) {
    // If the score to increase is not for first player do not increase it.
    if ((this.isFirstPlayer && this.scuttle !== player) ||
      (!this.isFirstPlayer && this.player2 !== player)) {
      return
    }
    let increase = this.scoreManager.increaseScore(key)
    this.score += increase
    this.scoreText.setText(this.scoreString + this.score)
    let text = this.add.text(this.scoreText.width + 5 + this.scoreText.x,
      this.scoreText.y, '+' + increase)
      .setScrollFactor(0)
      .setFontFamily('Fredoka One')
      .setFontSize(25)
    this.tweens.add({
      targets: text,
      duration: 1000,
      y: '-=50',
      alpha: 0,
      delay: 200,
      onComplete: (tweens, targets) => {
        targets[0].destroy()
      }
    })
    return increase
  }

  updateScoreUI (increase) {

  }

  addTextScore (x, y, score) {
    let text = this.add.text(x - 2, y, score)
      .setFontSize(15)
      .setFontFamily('Fredoka One')
    this.tweens.add({
      targets: text,
      alpha: 0,
      duration: 1000,
      scaleX: 2,
      scaleY: 2,
      onComplete: (tweens, target) => {
        target[0].destroy()
      }
    })
    // this.time.delayedCall(1000, () => { text.destroy() }, [], text)
  }

  /**
   * The replay function displays the food by making all food that were previously invisible
   * visible again. It also resets the number of lives and the score of the player. It doesn't
   * use the in-built Phaser restart function.
   */
  replay () {
    this.scuttle.lives = 3
    this.score = 0
    this.numFoodEaten = 0
    this.isPaused = true
    this.enemies.disappears()
    this.foodLayer.forEachTile((tile) => {
      // console.log(tile)
      if (tile.index !== -1 && !tile.visible) {
        tile.setVisible(true)
      }
    })
    console.log(this.specialFood, this)
    this.specialFood.reEnableChildren()
    this.soundManager.playNormalBgm('loop')
    // }, tile, levelData.mapWidth, levelData.mapHeight,
    //   constants.TileSize, constants.TileSize,
    //   {isNotEmpty: true})
    this.scoreText.setText(this.scoreString + this.score)
    this.restartGame()
  }

  createLights () {
    // console.log(this.test)
    // console.log('Before', this.tileLayer, this.scuttle.egg)
    //
    // this.tileLayer.setPipeline('Light2D')
    //
    // this.scuttle.egg.setPipeline('Light2D')
    //
    // console.log('After', this.tileLayer, this.scuttle.egg)
    //
    // this.light = this.lights.addLight(0, 0, 300, 16777215, 3)
    // this.lights.enable().setAmbientColor(0x555555)
    // this.light.setRadius(300)
    // this.tileLayer.resetPipeline()
    // this.scuttle.egg.resetPipeline()
  }

  followScuttle (scuttle) {
    if (constants.DEBUG && typeof this.light !== 'undefined') {
      this.light.x = scuttle.x - 150
      this.light.y = scuttle.y + 150
    }
  }

  checkScoreToEndGame () {
    if (this.numFoodEaten >= levelData.numFood) {
      console.warn('gameover', this.numFoodEaten, this.normalBGM)
      this.gameOver('win')
      return true
    }
  }

  gameOver (type) {
    let isAlpha = true // Change this to allow different screens
    // console.log(this.plugins)
    // console.log(this.normalBGM)
    // let soundFadeOut = this.plugins.get('rexSoundFade').fadeIn
    // let soundFadeIn = this.plugins.get('rexSoundFade').fadeOut
    // soundFadeOut(this.scene.get('gameover'), this.normalBGM, 300, false)
    this.soundManager.setBgmVolume(0.1)
    if (type === 'win') {
      this.soundManager.playWinSequence()
    } else {
      console.log('did it come here', this)
      this.soundManager.playGameOverSequence()
    }
    this.scene.launch('gameover', {
      lives: this.scuttle.lives,
      score: this.score,
      prevScene: this,
      button: this.soundManager.buttonSfx,
      type: type,
      bgm: this.soundManager.normalBGM,
      isAlpha: isAlpha
    })
    this.scene.pause()
  }

  checkGameSize () {
    let width = this.sys.game.config.width
    let height = this.sys.game.config.height

    if (width > levelData.WIDTH || height > levelData.HEIGHT) {
      let scale1 = width / levelData.WIDTH
      let scale2 = height / levelData.HEIGHT
      if (scale1 > scale2) {
        this.cameras.main.setZoom(scale1)
      } else {
        this.cameras.main.setZoom(scale2)
      }
      this.resizeGame(width, height)
    } else {
      this.cameras.main.setZoom()
      this.cameraView = this.cameras.main.worldView
      if (width !== this.cameraView.width ||
        height !== this.cameraView.height) {
        this.resizeGame(width, height)
        console.log('did it resize')
      }
      // console.log(this.cameraView, width, height)
    }
  }

  getTargetInformationForEnemy () {
    let targetPosition = this.enemyTarget.getCurrentPosition()
    let targetDirection = this.enemyTarget.getCurrentDirection()
    return {position: targetPosition, direction: targetDirection}
  }

  scuttleDies (num, player) {
    if (this.optionFlag) {
      // Option 1: getEaten and enemyVO happens together then scuttleDiesVO
      this.soundManager.playScuttleDiesSequenceOne(num)
    } else {
      // Option 2: getEaten --> crabVO --> enemyVO
      this.soundManager.playScuttleDiesSequenceTwo(num)
    }
    player.dies()
    // if ((typeof NODE_ENV === 'undefined' && NODE_ENV !== 'production')|| this.isTwoPlayer) {
    if ((true)|| this.isTwoPlayer) {
      this.currentMode = 0
      this.enemies.scatter()
    } else {
      this.isPaused = true // previous logic where enemies will disappear when scuttle dies
      this.enemies.disappears()
    }
  }

  resizeGame (width, height) {
    this.cameras.main.setSize(width, height)
    this.cameraView = this.cameras.main.worldView
    console.log(this.cameraView, this.sys.game.config.width, this.sys.game.config.height)
  }
}

export default MainGame
