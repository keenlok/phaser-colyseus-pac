import * as constants from '../../shared/config/constants'
import * as levelData from '../../shared/leveldata/NewLevelData'
import Phaser from 'phaser'
import * as GameObjectFactory from '../gameObjectFactory'
import PhysicsFactory from '../../shared/factory/PhysicsFactory'
import AnimationFactory from '../../shared/factory/AnimationFactory'
import ScoreManager from '../../shared/manager/ScoreManager'

const SCATTER = 'scatter'
const CHASE = 'chase'

class Headless extends Phaser.Scene {
  constructor () {
    super({ key: 'maingame' })
    this.isTwoPlayer = false
    this.initializeVariables()
  }

  /** ----- Start of Main methods ----- **/
  preload () {
    Headless.messageLog("Initialise: Preload")
    this.loadAssets()
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
        mode: SCATTER,
        time: 14000
      },
      {
        mode: CHASE,
        time: 40000
      },
      {
        mode: SCATTER,
        time: 14000
      },
      {
        mode: CHASE,
        time: 40000
      },
      {
        mode: SCATTER,
        time: 10000
      },
      {
        mode: CHASE,
        time: 40000
      },
      {
        mode: SCATTER,
        time: 10000
      },
      {
        mode: CHASE,
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
      Headless.messageLog(data)
      this.scene.stop(data.menu.key)
    }
  }

  create () {
    Headless.messageLog("Initialise: Create")

    Headless.messageLog("Create: Anims")
    AnimationFactory.createAllAnimations(this.anims)

    Headless.messageLog("Create: GameObjects")
    GameObjectFactory.createObjectsForHeadless(this)

    Headless.messageLog("Create: Setup Physics")
    this.physicsFactory = new PhysicsFactory(this, this.physics)
    this.physicsFactory.setupPhysicsForRelevantObjects(this.scuttle, this.enemies.getChildren(), this.specialFood.children)

    Headless.messageLog("Create: Setup Score Manager")
    this.scoreManager = new ScoreManager(this)

    this.scene.pause()
    console.log("Paused! Waiting to Resume")
    this.restartGame()
    this.enemyTarget = this.scuttle
  }

  update (time) {
    if (!this.isPaused) {
      this.checkTimer()
      if (!this.scuttle.isDead || !this.isRepeating) {
        this.checkEnemiesBehaviour(time)
      }
      this.updatePlayer()
      this.updateEnemies(time)
    }
    this.checkScoreToEndGame()
  }
  /**  ----- End of Main methods -----   */


  // ------------------------------------ Methods for Enemies -------------------------------------//
  checkEnemiesBehaviour (time) {
    if (!this.isPinkOut) {
      // this.messageLog('hello?')
      // this.sendExitOrder(this.enemies.enemy)
      // this.messageLog(this.enemies.enemy3)
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
        if (this.TIME_MODES[this.currentMode].mode === CHASE) {
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
        if (this.TIME_MODES[this.currentMode].mode === CHASE) {
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
    this.events.emit('changeMode')
    Headless.messageLog('new mode:', this.TIME_MODES[this.currentMode].mode, this.TIME_MODES[this.currentMode].time)
  }

  giveExitOrder (enemy) {
    let remainingTime = this.changeModeTimer - this.time.now
    // Delay enemy exit until the powerup mode is over
    // this.messageLog('did i send something', enemy)
    this.time.delayedCall(remainingTime + (Math.random() * 3000), this.sendExitOrder, [enemy], this)
  }

  updateEnemies (time) {
    this.enemies.update(time)
  }

  sendAttackOrder () {
    this.events.emit('send_attack')
    this.enemies.attack()
  }

  sendExitOrder (enemy) {
    console.log("Waking enemy", enemy.name, enemy.type)
    this.events.emit('send_exit', enemy)

    // this.messageLog(enemy)
    // enemy.mode = this.enemy.EXIT_HOME
    enemy.egg.anims.delayedPlay(1, 'enemy_spawn')
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
  // ---------------------------------End of Methods for Enemies -----------------------------------//


  // ------------------------------------ Methods for Players -------------------------------------//
  updatePlayer () {
    this.scuttle.continueMoving()
  }

  setupCollidersForPlayer (player) {
    // this.messageLog('using new method')
    this.physicsFactory.setupPhysicsForPlayer(player, this.enemies.children, this.specialFood.children)
  }
  // ---------------------------------End of Methods for Players -----------------------------------//


  // --------------------------------------- For The Game -----------------------------------------//
  resetTimer () {
    Headless.messageLog(this.time.now, this.SFXTimer, this.changeModeTimer)
    this.scuttle.testTimer = this.time.now
    // this.soundManager.resetTimer(this.time.now)
    this.changeModeTimer = this.time.now + this.TIME_MODES[this.currentMode].time
  }

  getCurrentMode () {
    if (!this.isHuntMode) {
      return this.TIME_MODES[this.currentMode].mode
    } else {
      return 'random'
    }
  }

  checkTimer () {
    if (this.timerIsInvalid(this.changeModeTimer)) {
      Headless.messageLog(this.changeModeTimer, this.time.now)
      this.resetTimer()
      // If the timer isnt started, the game wont enter the other modes
    }
  }

  timerIsInvalid (timer) {
    return timer === 0 || timer > Math.pow(10, 12)
  }

  returnToNormal () {
    this.events.emit('return_normal')
    this.enemies.returnToNormal()
    this.scuttle.returnToNormal()
    this.count = 0
  }

  changeToHuntMode (player) {
    this.events.emit('change_to_hunt')
    // This should prevent the game from triggering hunt mode when the game is won
    if (!this.checkScoreToEndGame()) {
      this.enemies.becomeScared()
      if (!this.isHuntMode) {
        this.remainingTime = this.changeModeTimer - this.time.now
        // this.soundManager.doTransitionToHuntFromNormal()
      }
      this.changeModeTimer = this.time.now + this.FRIGHTENED_MODE_TIME
      this.isHuntMode = true
      player.powerUp()
      Headless.messageLog('Hunt Mode remaining time:', this.remainingTime)
    }
  }

  restartGame (args) {
    this.events.emit('restartGame')
    let player
    // this.messageLog(args === this.scuttle)
    if (typeof args === 'undefined') {
      player = this.scuttle
    } else {
      player = args
    }
    Headless.messageLog('Player has died, Restarting Game')
    this.currentMode = 0
    this.isHuntMode = false
    player.returnToNormal()
    if (player.lives > 0) {
      player.respawn()
      this.isPaused = false
      // This makes sure that the enemies doesn't always respawn when scuttle dies
      if (player.lives === 3) {
        this.resetEnemies()
      }
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

  // Pause the game just pauses the scene, not launch a new scene
  launchPauseScreen () {
    this.scene.pause()
    // this.scene.launch('pause', {
    //   scene: this,
    // })
  }

  // The scuttle eats food that are visible. Eating the food will turn it
  // invisible, and increase the score.
  eatFood (player, tile) {
    if (tile.visible) {
      tile.setVisible(false)
      this.increaseScore('normalfood', player)
      this.numFoodEaten++
    }
  }

  eatBiggerCoin (player, coin) {
    if (coin.visible) {
      this.increaseScore('specialfood', player)
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
    // this.scoreText.setText(this.scoreString + this.score)
    // let text = this.add.text(this.scoreText.width + 5 + this.scoreText.x,
    //   this.scoreText.y, '+' + increase)
    //   .setScrollFactor(0)
    //   .setFontFamily('Fredoka One')
    //   .setFontSize(25)
    // this.tweens.add({
    //   targets: text,
    //   duration: 1000,
    //   y: '-=50',
    //   alpha: 0,
    //   delay: 200,
    //   onComplete: (tweens, targets) => {
    //     targets[0].destroy()
    //   }
    // })
    return increase
  }

  updateScoreUI (increase) {

  }

  addTextScore (x, y, score) {
    let text = this.add.text(x - 2, y, score)
      .setFontSize(15)
      .setFontFamily('Fredoka One')
    // this.tweens.add({
    //   targets: text,
    //   alpha: 0,
    //   duration: 1000,
    //   scaleX: 2,
    //   scaleY: 2,
    //   onComplete: (tweens, target) => {
    //     target[0].destroy()
    //   }
    // })
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
      // this.messageLog(tile)
      if (tile.index !== -1 && !tile.visible) {
        tile.setVisible(true)
      }
    })
    this.specialFood.reEnableChildren()
    // }, tile, levelData.mapWidth, levelData.mapHeight,
    //   constants.TileSize, constants.TileSize,
    //   {isNotEmpty: true})
    this.scoreText.setText(this.scoreString + this.score)
    this.restartGame()
  }

  checkScoreToEndGame () {
    if (this.numFoodEaten >= levelData.numFood) {
      // console.warn('gameover', this.numFoodEaten, this.normalBGM)
      this.gameOver('win')
      return true
    }
  }

  // Just pause the game since cannot launch new scene in HEADLESS
  gameOver (type) {
    // let isAlpha = true // Change this to allow different screens
    // this.scene.launch('gameover', {
    //   lives: this.scuttle.lives,
    //   score: this.score,
    //   prevScene: this,
    //   type: type,
    //   isAlpha: isAlpha
    // })
    Headless.messageLog("Game over "+ this.scuttle.lives)
    this.scene.pause()
  }

  getTargetInformationForEnemy () {
    // if (this.currentMode)
    let targetPosition = this.enemyTarget.getCurrentPosition()
    let targetDirection = this.enemyTarget.getCurrentDirection()
    return {position: targetPosition, direction: targetDirection}
  }

  scuttleDies (num, player) {
    player.dies()
    // if ((typeof NODE_ENV === 'undefined' && NODE_ENV !== 'production') || this.isTwoPlayer) {
    if ((true) || this.isTwoPlayer) {
      this.currentMode = 0
      this.enemies.scatter()
    } else {
      this.isPaused = true // previous logic where enemies will disappear when scuttle dies
      this.enemies.disappears()
    }
  }

  /**  ----------  Start of preload methods --------- */
  loadAssets () {
    Headless.messageLog("Preload: Backgrounds")
    this.load.image('background', '../../public/assets/background-2x.png')

    Headless.messageLog("Preload: Dots")
    this.load.spritesheet('specialDot', '../../public/assets/dots.png', {
      frameHeight: 16,
      frameWidth: 16
    })

    Headless.messageLog("Preload: Sprites")
    this.loadSprites()
    // this.loadAudio()

    Headless.messageLog("Preload: Map")
    this.loadMap()
  }

  loadMap () {
    this.load.image('tile', '../../public/assets/map/final-extruded-again.png')
    this.load.image('foodTile', '../../public/assets/map/food.png')
    this.load.spritesheet('powerup', '../../public/assets/map/power-up-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.tilemapTiledJSON('newmap', '../../public/assets/map/map.json')

    this.load.image('coral', '../../public/assets/map/coral-small-v1.png')
  }

  loadSprites () {
    Headless.messageLog("Preload: Sprites: Scuttles")

    /** Scuttles spritesheets */
    this.load.spritesheet('scuttle', '../../public/assets/sprites/player/original/scuttle.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_die', '../../public/assets/sprites/player/original/crab-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_spawn', '../../public/assets/sprites/player/original/crab-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_wobble', '../../public/assets/sprites/player/original/crab-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    this.load.spritesheet('happy', '../../public/assets/sprites/player/original/superhappy.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    Headless.messageLog("Preload: Sprites: Enemies")
    this.loadEnemies()
  }

  loadEnemies () {
    Headless.messageLog("Preload: Sprites: Enemies: Commons")

    this.load.spritesheet('enemy_spawn', '../../public/assets/sprites/enemies/enemy-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('enemy_wobble', '../../public/assets/sprites/enemies/enemy-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('dead_spirit', '../../public/assets/sprites/enemies/glow-loop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.loadHermit()
    this.loadJelly()
    this.loadOctopus()
    this.loadShark()
  }

  loadHermit () {
    Headless.messageLog("Preload: Sprites: Enemies: Hermit")

    this.load.spritesheet('hermit_left', '../../public/assets/sprites/enemies/hermit/hermit-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_left', '../../public/assets/sprites/enemies/hermit/hermit-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_right', '../../public/assets/sprites/enemies/hermit/hermit-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_right', '../../public/assets/sprites/enemies/hermit/hermit-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_dying', '../../public/assets/sprites/enemies/hermit/hermit-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadJelly () {
    Headless.messageLog("Preload: Sprites: Enemies: Jelly")

    /** Jelly */
    this.load.spritesheet('jelly_left', '../../public/assets/sprites/enemies/jelly/jelly-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_right', '../../public/assets/sprites/enemies/jelly/jelly-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_left', '../../public/assets/sprites/enemies/jelly/jelly-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_right', '../../public/assets/sprites/enemies/jelly/jelly-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_dying', '../../public/assets/sprites/enemies/jelly/jelly-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadShark () {
    Headless.messageLog("Preload: Sprites: Enemies: Shark")

    /** shark */
    this.load.spritesheet('shark_left', '../../public/assets/sprites/enemies/shark/shark-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_right', '../../public/assets/sprites/enemies/shark/shark-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_left', '../../public/assets/sprites/enemies/shark/shark-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_right', '../../public/assets/sprites/enemies/shark/shark-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadOctopus () {
    Headless.messageLog("Preload: Sprites: Enemies: Octopus")

    /** octo */
    this.load.spritesheet('octo_left', '../../public/assets/sprites/enemies/octo/octo-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_right', '../../public/assets/sprites/enemies/octo/octo-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_left', '../../public/assets/sprites/enemies/octo/octo-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_right', '../../public/assets/sprites/enemies/octo/octo-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_dying', '../../public/assets/sprites/enemies/octo/octo-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }
  /**  ---------  End of preload methods ---------- */

  static messageLog(...messages) {
    constants.messageLog('Game', messages)
  }
}

export default Headless
