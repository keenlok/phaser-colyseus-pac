import * as constants from '../../../shared/config/constants'
import * as levelData from '../../../shared/leveldata/newLevelData'
import * as GameObjectFactory from '../gameObjectFactory'
import PhysicsFactory from '../../../shared/factory/physicsFactory'
import AnimationFactory from '../../../shared/factory/animationFactory'
import ScoreManager from '../../../shared/manager/scoreManager'
import Preload from './preload'

import Phaser from 'phaser'

const SCATTER = 'scatter'
const CHASE = 'chase'
const WIN = 'win'
const LOSE = 'lose'

class Headless extends Preload {

  constructor () {
    super({ key: 'maingame' })
    this.isTwoPlayer = false
    this.initializeVariables()
  }

  /** ----- Start of Main methods ----- **/

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
    this.targetTimer = 0
    this.alternateTime = 29000
    this.currentMode = 0
    this.FRIGHTENED_MODE_TIME = 24000
    this.isHuntMode = false
    this.enemy = null
    this.enemyTarget = null
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

    Headless.messageLog("Create: Listeners")
    // this.createListeners()

    Headless.messageLog("Create: Anims")
    AnimationFactory.createAllAnimations(this.anims)

    Headless.messageLog("Create: GameObjects")
    GameObjectFactory.createObjectsForHeadless(this)

    Headless.messageLog("Create: Setup Physics")
    this.physicsFactory = new PhysicsFactory(this, this.physics)
    this.physicsFactory.setupPhysicsForRelevantObjects(this.enemies.getChildren())

    Headless.messageLog("Create: Setup Score Manager")
    this.scoreManager = new ScoreManager(this)

    // this.scene.pause()
    console.log("Paused! Waiting to Resume")
    // this.restartGame()
    // this.enemyTarget = this.scuttle
  }

  // createListeners() {
  //   this.events.on('player_created', (player) => {
  //
  //   }, this)
  // }

  update (time) {
    if (!this.isPaused) {
      this.checkTimer()
      this.alternateTargets(time)
      if (!this.isRepeating) {
        this.checkEnemiesBehaviour(time)
      }
      this.updatePlayer()
      this.updateEnemies(time)
    }
    this.checkScoreToEndGame()
  }
  /**  ----- End of Main methods -----   */


  /** ------------------------------------ Methods for Enemies -------------------------------------*/
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

  getTargetInformationForEnemy () {
    // if (this.currentMode)
    let targetPosition = this.enemyTarget.getCurrentPosition()
    let targetDirection = this.enemyTarget.getCurrentDirection()
    return {position: targetPosition, direction: targetDirection}
  }

  alternateTargets(time) {
    if (this.targetTimer <= time) {
      console.log("Alternating targets", this.targetTimer, time)
      this.targetTimer = time + this.alternateTime
      this.setTarget()
    }
  }

  setTarget() {
    let keys = Object.keys(this.players)
    let alternated = false
    let count = 0
    console.log(keys)
    if (keys.length === 1) {
      let key = keys[0]
      this.enemyTarget = this.players[key]
      Headless.messageLog("Target set!", this.enemyTarget.id)
    } else {
      // while (!alternated && count++ < 5) {
      //   let key = Phaser.Math.RND.between(0, keys.length - 1)
      //   console.log("what key is generated?", key)
      //   if (typeof this.enemyTarget === "undefined" || this.enemyTarget !== this.players[key]) {
      //     this.enemyTarget = this.players[key]
      //     alternated = true
      //     console.log("Target alternated!")
      //   }
      // }
      if (this.enemyTarget === this.players[keys[0]]) {
        this.enemyTarget = this.players[keys[1]]
        // console.log("Current Enemy", this.players[keys[1]].id)
      } else {
        this.enemyTarget = this.players[keys[0]]
        // console.log("Current Enemy", this.players[keys[0]].id)
      }
    }
  }

  eats (player, enemy) {
    // console.log("What is received?", enemy.name);
    let num
    if (!enemy.isDead) {
      Headless.messageLog(`${enemy.name+enemy.type} met this player ${player.name}`)
      if (this.isHuntMode && player.isPowerUp) {
        num = player.eatAudio
        enemy.dies(player)
      } else if (!player.isDead) {
        num = enemy.eatAudio
        this.events.emit('eat_player', player, num)
        this.playerDies(num, player)
      }
    }
  }
  // ---------------------------------End of Methods for Enemies -----------------------------------//


  /** ------------------------------------ Methods for Players -------------------------------------*/
  createNewPlayer(id) {
    Headless.messageLog('Creating new player with id', id)
    let player = GameObjectFactory.createPlayer(this, id)
    this.setupCollidersForPlayer(player)
    Headless.messageLog('New player with id created', id)
    this.events.emit('player_created', player)
  }

  updatePlayer () {
    for (let id in this.players) {
      this.players[id].continueMoving()
    }
  }

  initialiseSecond(id) {
    Headless.messageLog('what is this id', id)
    let player = GameObjectFactory.createPlayer2(this)
    player.id = id
    this.setupCollidersForPlayer(player)
  }

  setupCollidersForPlayer (player) {
    Headless.messageLog('Setting up physics for player', player.id)
    this.physicsFactory.setupPhysicsForPlayer(player, this.enemies.getChildren(), this.specialFood.children)
  }
  // ---------------------------------End of Methods for Players -----------------------------------//


  /** --------------------------------------- For The Game -----------------------------------------*/
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
    this.group.returnToNormal()
    this.count = 0
  }

  changeToHuntMode (player) {
    this.events.emit('change_to_hunt', player)
    // This should prevent the game from triggering hunt mode when the game is won
    if (!this.checkScoreToEndGame()) {
      this.enemies.becomeScared()
      if (!this.isHuntMode) {
        this.remainingTime = this.changeModeTimer - this.time.now
        // this.soundManager.doTransitionToHuntFromNormal()
      }
      this.changeModeTimer = this.time.now + this.FRIGHTENED_MODE_TIME
      this.changeModeTimer = this.time.now + this.FRIGHTENED_MODE_TIME
      this.isHuntMode = true
      player.powerUp()
      Headless.messageLog('Hunt Mode remaining time:', this.remainingTime)
    }
  }

  restartGame (player) {
    this.events.emit('restartGame', player)
    // let player
    // this.messageLog(args)
    // if (typeof player === 'undefined') {
    //   player = this.scuttle
    // } else {
    //   // player = pl
    //   // console.log(player.id)
    // }
    Headless.messageLog('Restarting Game', player.id)
    if (Object.keys(this.players).length === 1) {
      Headless.messageLog('Resetting modes')
      this.currentMode = 0
      this.isHuntMode = false
    }
    player.returnToNormal()
    if (player.lives > 0) {
      player.respawn()
      this.isPaused = false
      // This makes sure that the enemies doesn't always respawn when scuttle dies
      if (player.lives === 3) {
        Headless.messageLog('Resetting modes')
        this.resetEnemies()
      }
      this.isRepeating = false
      this.changeModeTimer = this.time.now + this.TIME_MODES[this.currentMode].time
      this.count = 0
    } else {
      this.gameOver(LOSE, player)
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
      // console.log("what is eat Audio?", num, obj1.eatAudio, obj2.eatAudio)
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

  resumeGame(key) {
    this.scene.resume(key)
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
    // if ((this.isFirstPlayer && this.scuttle !== player) ||
    //   (!this.isFirstPlayer && this.player2 !== player)) {
    //   return
    // }
    // if (player !== )
    let increase = this.scoreManager.increaseScore(key)
    player.score += increase
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
      this.gameOver(WIN)
      return true
    }
  }

  // Just pause the game since cannot launch new scene in HEADLESS
  gameOver (type, player) {
    if (type === WIN) {
      Headless.messageLog(`Game over: WIN`)
      for (let id in this.players) {
        let player = this.players[id]
        //TODO: Do something with these information?
        Headless.messageLog(`Game over: ${player.id}: Lives: ${player.lives}, Score: ${player.score}`)
      }
    } else if (type === LOSE) {
      Headless.messageLog(`Game over: LOSE ${player.id}: Lives: ${player.lives}, Score: ${player.score}`)
    }
    this.scene.pause()
  }

  playerDies (num, player) {
    Headless.messageLog("comes here")
    player.dies()
    // if ((typeof NODE_ENV === 'undefined' && NODE_ENV !== 'production') || this.isTwoPlayer) {
    if (this.isTwoPlayer) {
      if (!this.isHuntMode) {
        this.currentMode = 0
        this.enemies.scatter()
      }
    }
    else if (!this.isTwoPlayer) {
      this.isPaused = true // previous logic where enemies will disappear when scuttle dies
      this.enemies.disappears()
    }
  }

  static messageLog(...messages) {
    constants.messageLog('Game', messages)
  }
}

export default Headless
