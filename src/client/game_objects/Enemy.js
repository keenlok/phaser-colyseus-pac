import * as constants from '../../shared/config/constants'
import * as levelData from '../../shared/leveldata/NewLevelData'
import Phaser from 'phaser'

const directions = constants.directions

class Enemy extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, type) {
    super(scene, x, y, texture)
    // Phaser.GameObjects.Sprite.call(this, scene, x, y, type)
    scene.physics.world.enable(this)
    scene.children.add(this)
    // ------- Trying stuff -------- //
    this.initializeVariables(x, y, texture, type)

    if (this.type !== 'type_shark') {
      // this.messageLog(this)
      this.createEgg()
    }
    this.createAnimListener()
  }

  initializeVariables(x, y, texture, type) {
    this.initX = x
    this.initY = y

    this.baseSpeed()
    this.turnTimer = 0
    this.RANDOM = 'random'
    this.SCATTER = 'scatter'
    this.CHASE = 'chase'
    this.STOP = 'stop'
    this.AT_HOME = 'at_home'
    this.EXIT_HOME = 'leaving_home'
    this.RETURNING_HOME = 'returning_home'
    this.isAttacking = false

    this.mode = this.AT_HOME
    this.prevMode = this.mode
    this.scatterDestination = constants.convertToPixels(levelData.mapWidth, levelData.mapHeight)

    this.directions = [null, null, null, null, null]
    this.opposites = [
      directions.NONE, directions.RIGHT, directions.LEFT,
      directions.DOWN, directions.UP
    ]
    this.turnPoint = new Phaser.Geom.Point()
    this.lastPosition = {x: -1, y: -1}
    this.safetiles = [constants.SAFE_TILE, constants.DOT_TILE]
    this.isDead = false

    switch (texture) {
      case 'shark_left':
        this.name = 'shark'
        // this.play('shark_right')
        break
      case 'hermit_left':
        this.name = 'hermit'
        // this.play('hermit_left')
        break
      case 'jelly_left':
        this.name = 'jelly'
        break
      case 'octo_left':
        this.name = 'octo'
        break
      default:
        console.warn('Please use the correct texture name!', texture)
        this.name = 'hermit'
        break
    }

    // The type will determine the enemies' behaviour
    this.setBehaviourType(type)
    this.previousDir = this.currentDir
    this.isFrightened = false
    this.body.setSize(constants.TileSize, constants.TileSize)
  }

  setBehaviourType (type) {
    this.type = type

    switch (this.type) {
      case 'type1':
        this.scatterDestination = constants.convertToPixels(levelData.mapWidth, 0)
        this.safetiles = [constants.SAFE_TILE, constants.DOT_TILE]
        this.mode = this.AT_HOME
        this.start = levelData.START_COORD.A
        this.currentDir = this.start.startDir
        break
      case 'type2':
        this.scatterDestination = constants.convertToPixels(0, 0)
        this.start = levelData.START_COORD.D
        this.currentDir = this.start.startDir

        // this.move(this.currentDir)
        break
      case 'type3':
        this.scatterDestination = constants.convertToPixels(0, levelData.mapHeight)
        this.start = levelData.START_COORD.C
        this.currentDir = this.start.startDir
        break
      case 'type4':
        this.start = levelData.START_COORD.B
        this.currentDir = this.start.startDir
        break
      default:
        console.warn('INVALID ENEMY TYPE CREATED', this.type)
        break
    }

    if (type === 'type_shark') {
      this.currentDir = directions.LEFT
    }
  }

  baseSpeed () {
    this.enemySpeed = 250 // initital: 150
    this.enemyScatterSpeed = 200 // before: 125
    this.enemyFrightenedSpeed = 150 // before: 75
    this.cruiseElroySpeed = 500 // before: 160

    this.TURNING_COOLDOWN = 150
    this.RETURNING_COOLDOWN = 100
    this.RANDOM_COOLDOWN = 150
  }

  createAnimListener () {
    this.on('animationcomplete', () => {
      if (this.anims.currentAnim.key === this.name + '_dying') {
        this.play('dead_spirit')
        this.alreadyDead = true
      }
      if (this.anims.currentAnim.key.includes('jelly')) {
        this.messageLog(this.anims.currentAnim.key)
      }
    }, [], this)

    this.on('animationupdate', () => {
      if (this.anims.currentAnim.key.includes('jelly')) {
        if (this.visible && this.anims.currentFrame === 13) {
          this.scene.soundManager.jellyPropelSfx.play()
        }
      }
    }, [], this)

    this.egg.on('animationcomplete', () => {
      if (this.egg.anims.currentAnim.key === 'enemy_spawn') {
        this.scene.soundManager.popSfx.play()
        this.setVisible(true)
        this.egg.setVisible(false)
        this.scene.time.delayedCall(3000, this.resetEgg, [], this)
        this.mode = this.EXIT_HOME
      }
    }, [], this)
  }

  createEgg () {
    this.egg = this.scene.add.sprite(this.initX, this.initY, 'enemy_egg')
    this.egg.setScale(0.5)
    let num = Math.round(Math.random() * 24)
    this.egg.play('enemy_egg', true, num)
    switch (this.type) {
      case 'type1':
        this.egg.setAngle(40)
        this.egg.setScale(0.4)
        this.egg.flipX = true
        break
      case 'type2':
        this.egg.setAngle(-75)
        this.egg.setScale(0.6)
        break
      case 'type3':
        this.egg.setAngle(-45)
        this.egg.setScale(0.5)
        break
      case 'type4':
        this.egg.setAngle(45)
        this.egg.flipX = true
        this.egg.setScale(0.7)
        break
      default:
        break
    }
  }

  resetEgg () {
    let num = Math.round(Math.random() * 24)
    this.egg.play('enemy_egg', true, num)
    this.egg.setVisible(true)
  }

  respawn () {
    this.body.setVelocity(0)
    this.x = this.initX
    this.y = this.initY
    this.mode = this.AT_HOME
    this.isDead = false
    this.isAttacking = false
    this.setVisible(false)
    this.currentDir = this.start.startDir
    this.safetiles = [constants.SAFE_TILE]
    // }
  }

  returnToNormal () {
    this.isFrightened = false
    if (this.mode !== this.RETURNING_HOME) {
      if (this.currentDir === directions.LEFT || this.currentDir === directions.UP) {
        this.play(this.name + '_left')
      } else {
        this.play(this.name + '_right')
      }
      this.alreadyTriggered = false
    } else if (this.mode === this.RETURNING_HOME && this.isDead) {
      this.respawn()
    }
    if (this.name === 'jelly' && (this.currentDir ===  directions.UP ||
      this.currentDir ===  directions.DOWN)) {
      this.setAngle(90)
    }
    if (this.mode === this.RANDOM) {
      if (this.prevMode !== this.AT_HOME && this.prevMode !== this.EXIT_HOME) {
        this.mode = this.prevMode
      } else {
        this.mode = this.scene.getCurrentMode()
      }
    }
  }

  resetPosition (x, y) {
    this.turnPoint = constants.convertToPixels(x, y)
    this.x = this.turnPoint.x
    this.y = this.turnPoint.y
    this.body.reset(this.turnPoint.x, this.turnPoint.y)
  }

  /** This movement function is quite similar to scuttle */
  move (direction) {
    // if (direction === directions.NONE) {
    //   this.body.setVelocity(0, 0)
    //   return
    // }
    this.previousDir = this.currentDir
    this.currentDir = direction
    let editedName = this.name + '_'
    this.blendMode = Phaser.BlendModes.NORMAL
    let animType = this.getCurrentAnimType(editedName)

    this.flipX = false

    this.playRespectiveAnimation(direction, animType)

    this.setAngle(0)
    if (direction === directions.LEFT || direction === directions.RIGHT) {
    } else {
      if (this.name === 'jelly') {
        this.setAngle(90)
      }
    }
  }


  playRespectiveAnimation (direction, animType) {
    // let editedName = this.name + '_'
    // animType = this.getCurrentAnimType(editedName)
    let animKey
    if (direction === directions.RIGHT || direction === directions.DOWN) {
      if (this.mode === this.RETURNING_HOME) {
        animKey = animType
        this.flipX = false
      } else {
        animKey = animType + 'right'
      }
      this.play(animKey, true)
    } else {
      if (this.mode === this.RETURNING_HOME) {
        animKey = animType
        this.flipX = true
      } else {
        animKey = animType + 'left'
      }
      this.play(animKey, true)
    }
  }

  getCurrentAnimType (name) {
    let animType = name
    if (this.isFrightened) {
      if (this.mode === this.RANDOM) {
        animType = animType + 'hunt_'
      } else if (this.mode === this.RETURNING_HOME) {
        if (this.alreadyDead) {
          animType = 'dead_spirit'
          this.blendMode = Phaser.BlendModes.ADD
        } else {
          animType = animType + 'dying'
        }
      }
    }
    return animType
  }

  getCurrentPosition () {
    let x = Phaser.Math.Snap.Floor(Math.floor(this.x), constants.TileSize) / constants.TileSize
    let y = Phaser.Math.Snap.Floor(Math.floor(this.y), constants.TileSize) / constants.TileSize

    return new Phaser.Geom.Point((x * constants.TileSize) + constants.CenterOffset,
      (y * constants.TileSize) + constants.CenterOffset)
  }

  getCurrentDirection () {
    return this.currentDir
  }

  getHomePosition () {
    return new Phaser.Geom.Point(this.initX, this.initY)
  }

  update (time) {
    this.isNear()
  }

  behaveAccordingly (mode) {
    console.log("What mode?", mode)
    this.mode = mode
    if (mode === this.AT_HOME) {
      this.setVisible(false)
    } else {
      this.setVisible(true)
    }
  }

  enterFrightenedMode () {
    this.isFrightened = true
    if (this.mode !== this.EXIT_HOME && this.mode !== this.RETURNING_HOME &&
      this.mode !== this.AT_HOME) {
      this.prevMode = this.mode
      this.mode = this.RANDOM
      this.isAttacking = false
    }

    if (this.currentDir === directions.LEFT || directions.UP) {
      this.play(this.name + '_hunt_left')
    } else {
      this.play(this.name + '_hunt_right')
    }
  }

  crabEatCrab (player) {
    let num
    this.messageLog("This method is called")
    if (!this.isDead) {
      this.messageLog('Met this player', player.name)
    }
  }

  delayedSpawn (){
    this.egg.anims.delayedPlay(1, 'enemy_spawn')
  }

  dies(player) {
    this.scene.soundManager.playEnemyDeathSFX()
    this.scene.soundManager.scuttleVO[1].play()
    // let score = this.scene.increaseScore('enemy_exp')
    // this.scene.addTextScore(this.x, this.y, score)
    this.mode = this.RETURNING_HOME
    this.isDead = true
    this.alreadyDead = false
    this.safetiles.push(...levelData.GHOST_HOUSE.TILES)
    if (this.opposites[this.currentDir] === player.currentDir) {
      this.move(this.opposites[this.currentDir])
    }
  }

  checkAnimFrame () {
    if (this.anims.currentAnim.key.includes('jelly')) {
      this.messageLog(this.anims.currentFrame)
    }
  }

  isNear () {
    if (this.scene.getCurrentMode() === this.CHASE && this.isAttacking &&
      (this.mode !== this.AT_HOME && this.mode !== this.RETURNING_HOME &&
        this.mode !== this.RANDOM && this.mode !== this.EXIT_HOME)) {
      // If there's a better variable name replace this.
      // This variable is the "view" around the character. Since scuttle is almost
      // always at the centre of attention, the distance between scuttle and the 2 ends
      // of the screen/window is around half the config width and height.
      let viewAroundCrab = {
        x: constants.TileSize * 5,
        y: constants.TileSize * 5
      }
      let maxDistFromCrab = Math.sqrt(Math.pow(viewAroundCrab.x, 2) + Math.pow(viewAroundCrab.y, 2))
      let crabPosition = this.scene.scuttle.getCurrentPosition()
      let myPosition = this.getCurrentPosition()
      let distance = Phaser.Math.Distance.Between(crabPosition.x, crabPosition.y,
        myPosition.x, myPosition.y)
      if (maxDistFromCrab > distance) {
        if (!this.alreadyTriggered) {
          if (this.name === 'octo' || this.name === 'jelly') {
            // this.messageLog(this.mode + ' ' + this.name)
          }
          // this.messageLog(this.name + ' play alert sound and enemy chase sound')
          // TODO: this also breaks this.scene.popSFX is undefined. Probably a naming problem @keenlok
          if (!this.scene.soundManager.popSfx.isPlaying) {
            this.scene.soundManager.playAlertSound()
            this.alreadyTriggered = true
          }
        }
      } else {
        // if the enemy is already out of the frame, reset the trigger flag
        this.alreadyTriggered = false
      }
    }
  }

  messageLog(...message) {
    constants.messageLog(this.name+this.type, message)
  }
}

export default Enemy
