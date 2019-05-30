
// import Phaser from 'phaser'
import * as constants from './config/constants'
import * as levelData from './leveldata/NewLevelData'

class Scuttles extends Phaser.GameObjects.Group {
  constructor (scene) {
    super(scene)
    // Phaser.GameObjects.Group.call(this, scene)
    this.classType = Scuttle
    this.createScuttles()
    // console.log(scene)
    // // console.log(game.scene.scenes.user.uid)
    // console.log(scene.roomId)
    //   // this.getIdFromFirestore()
    // this.scuttle = this.getNumberOfScuttlesPlaying()
  }

  createScuttles () {
    let point = levelData.PLAYER_START[0]
    let startPoint = constants.convertToPixels(point.x, point.y)
    this.scuttle = this.create(startPoint.x, startPoint.y, 'scuttle')
  }

  getNumberOfScuttlesPlaying (playerList) {
    for (let i = 0; i < playerList.length; i++) {
      console.log(playerList[i])
      this.create((15 * constants.TileSize) + constants.CenterOffset,
        (18 * constants.TileSize) + constants.CenterOffset, 'scuttle')
    }
  }

  createSecondScuttle () {
    let point = levelData.PLAYER_START[1]
    let startPoint = constants.convertToPixels(point.x, point.y)
    this.scuttle2 = this.create(startPoint.x, startPoint.y, 'scuttle')
    return this.scuttle2
  }
}

class Scuttle extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, type, frame) {
    super(scene, x, y, 'scuttle')
    scene.physics.world.enable(this)
    scene.children.add(this)
    this.spawnPosition = { x: x, y: y }
    this.directions = [null, null, null, null, null]
    this.opposites = [
      constants.NONE, constants.RIGHT, constants.LEFT,
      constants.DOWN, constants.UP
    ]

    this.baseSpeed() // Threshold is basically the speed / game frame rate
    this.marker = new Phaser.Geom.Point()
    this.turnPoint = new Phaser.Geom.Point()
    this.currentDir = constants.NONE
    this.turning = constants.NONE
    this.lives = 3
    this.count = 1
    this.isDead = false
    this.isPowerUp = false

    this.alive = false
    this.test_coolDown = 2000

    console.log(`this is its initial x and y ${this.x} ${this.y}`)

    this.body.setSize(constants.TileSize, constants.TileSize)
    // constants.CenterOffset, constants.CenterOffset)
    // console.log("scuttle's body ", this.body)
    // this.move(constants.LEFT)

    this.createEgg(x, y)
    this.createAnimCompleteListeners()
    this.egg.anims.delayedPlay(Math.random() * 1000, 'egg')
  }

  createEgg (x, y) {
    this.egg = this.scene.add.sprite(x, y, 'egg')
    this.egg.initX = x
    this.egg.initY = y
    this.egg.parent = this
    this.resetEgg()
  }

  createAnimCompleteListeners () {
    // This is the callback function for scuttle's dying to reset the game
    this.on('animationcomplete', () => {
      if (this.anims.currentAnim.key === 'dying') {
        this.disappears()
      }
    }, this)

    this.egg.on('animationcomplete', () => {
      if (this.egg.anims.currentAnim.key === 'spawn') {
        console.log('spawn')
        this.egg.setVisible(false)
        this.egg.setPosition(this.egg.initX, this.egg.initY)
        this.scene.time.delayedCall(1000, this.resetEgg, [], this)
        this.alive = true
        this.isDead = false
        this.setVisible(true)
        if (this.lives === 3) {
          this.scene.resetEnemies()
        }
      }
    }, [], this)
  }

  resetEgg () {
    this.egg.play('egg', true)
    this.egg.setScale(0.5)
    if (this.x === this.egg.initX && this.y === this.egg.initY) {
      this.scene.time.delayedCall(5000, this.resetEgg, [], this)
    } else {
      this.egg.setVisible(true)
    }
  }

  checkDirection (turnTo) {
    if ((this.turning === turnTo && this.turning === this.currentDir) ||
      (this.directions[turnTo] !== null &&
        this.directions[turnTo].index !== constants.SAFE_TILE &&
        this.directions[turnTo].index !== constants.DOT_TILE)) {
      return
    }

    if (this.currentDir === this.opposites[turnTo]) {
      this.move(turnTo)
    } else {
      this.turning = turnTo

      this.turnPoint = constants.convertToPixels(this.marker.x, this.marker.y)
    }
  }

  turn () {
    let cx = Math.floor(this.x)
    let cy = Math.floor(this.y)

    if (constants.isInGrid(cx, this.turnPoint.x, cy, this.turnPoint.y, this.threshold)) {
      this.x = this.turnPoint.x
      this.y = this.turnPoint.y

      this.body.reset(this.turnPoint.x, this.turnPoint.y)

      this.move(this.turning)

      this.turning = constants.NONE

      return true
    }

    return false
  }

  move (direction) {
    let speed = this.speed
    let animType = 'move'
    if (this.isPowerUp) {
      animType = 'move_hunt'
      if (!this.scene.isHuntMode) {
        console.warn('ERROR: SCUTTLE ANIMATION IS WRONG')
      }
    }

    if (direction === constants.LEFT || direction === constants.UP) {
      speed = -speed
    }

    if (direction === constants.LEFT || direction === constants.RIGHT) {
      this.body.setVelocityX(speed)
    } else {
      this.body.setVelocityY(speed)
    }

    this.setAngle(0)

    this.play(animType, true)
    if (direction === constants.LEFT) {
      // this.play(animType + '_left')
      this.flipX = false
    } else if (direction === constants.RIGHT) {
      // this.play(animType + '_right')
      this.flipX = true
    }

    this.currentDir = direction
  }

  gestureControl (direction) {
    if (this.alive) {
      if (this.count === 1 && (direction !== constants.NONE)) {
        // this.scene.ghosts.startMoving()
        this.move(direction)
        this.count++
      }
      this.nextDirection = direction
      this.cheaperControls(direction)
    }
  }

  control (cursors) {
    if (this.alive) {
      if (this.count === 1 && (cursors.LEFT.isDown || cursors.RIGHT.isDown ||
        cursors.UP.isDown || cursors.DOWN.isDown)) {
        // this.scene.ghosts.startMoving()
        this.move(constants.LEFT)
        this.count++
      }

      if (cursors.LEFT.isDown || cursors.A.isDown) {
        this.nextDirection = constants.LEFT
        this.cheaperControls(this.nextDirection)
      } else if (cursors.RIGHT.isDown || cursors.D.isDown) {
        this.nextDirection = constants.RIGHT
        this.cheaperControls(this.nextDirection)
      } else if (cursors.UP.isDown || cursors.W.isDown) {
        this.nextDirection = constants.UP
        this.cheaperControls(this.nextDirection)
      } else if (cursors.DOWN.isDown || cursors.S.isDown) {
        this.nextDirection = constants.DOWN
        this.cheaperControls(this.nextDirection)
      } else {
        this.continueMoving()
      }
    }
  }

  continueMoving () {
    this.cheaperControls(this.nextDirection)
  }

  storeDirectionToMove (direction) {
    this.nextDirection = direction
    this.cheaperControls(this.nextDirection)
  }

  powerUp () {
    this.isPowerUp = true
    this.play('move_hunt')
    if (this.currentDir === constants.LEFT || this.currentDir === constants.UP) {
      this.flipX = false
    } else {
      this.flipX = true
    }
  }

  returnToNormal () {
    this.play('move', false)
    this.isPowerUp = false
  }

  cheaperControls (direction) {
    if (!this.scene.alreadyStarted && (direction === constants.LEFT ||
      direction === constants.RIGHT || direction === constants.UP ||
      direction === constants.DOWN)) {
      this.move(constants.LEFT)
      this.scene.alreadyStarted = true
    }

    this.marker = constants.convertToGridUnits(this.x, this.y)

    this.directions = constants.updateDirections(this.scene, this.marker.x, this.marker.y)

    this.cheaperCheckKeys(direction)

    if (this.turning !== constants.NONE) {
      this.turn()
    }

    this.checkWarp()
  }

  cheaperCheckKeys (direction) {
    if (direction === constants.LEFT && this.currentDir !== constants.LEFT) {
      // console.log('left')
      this.checkDirection(constants.LEFT)
    } else if (direction === constants.RIGHT && this.currentDir !== constants.RIGHT) {
      // console.log('right')
      this.checkDirection(constants.RIGHT)
    } else if (direction === constants.DOWN && this.currentDir !== constants.DOWN) {
      // console.log('down')
      this.checkDirection(constants.DOWN)
    } else if (direction === constants.UP && this.currentDir !== constants.UP) {
      // console.log('up')
      this.checkDirection(constants.UP)
    } else {
      this.turning = constants.NONE
    }
  }

  // the necessary adjustments when scuttle dies
  dies () {
    this.body.setVelocity(0)

    // This isDead flag is to prevent multiple calls(?) for the code below
    if (!this.isDead) {
      this.nextDirection = constants.NONE
      // this.scene.physics.pause()
      this.alive = false
      this.isDead = true
      this.anims.delayedPlay(500, 'dying')
      // console.log('dying', this.anims.isPaused, this.anims.isPlaying, this.anims)
    }
  }

  // scuttle becomes invisible
  disappears () {
    this.setVisible(false)
    this.lives--
    if (this.lives >= 0) {
      this.scene.time.delayedCall(500, this.scene.restartGame, [this], this.scene)
    }
  }

  // allows scuttle to wrap around the map
  checkWarp () {
    this.x = Phaser.Math.Wrap(this.x, 0, levelData.WIDTH)
    this.y = Phaser.Math.Wrap(this.y, 0, levelData.HEIGHT)
  }

  respawn () {
    if (!this.egg.visible) {
      this.egg.setVisible(true)
    }
    this.setVisible(false)
    this.setPosition(this.spawnPosition.x, this.spawnPosition.y)
    this.scene.tweens.add({
      targets: this.egg,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      onComplete: (tween, targets) => {
        targets[0].parent.moveEgg()
      }
    })
    // this.scene.soundManager.growAndPopSfx.play()
    this.currentDir = constants.RIGHT
    this.nextDirection = constants.NONE
    this.SPEED = 150
    this.body.setVelocity(0, 0)
    this.setAngle(0)
    this.play('move')
    this.count = 1
  }

  moveEgg () {
    this.scene.tweens.add({
      targets: this.egg,
      y: this.spawnPosition.y,
      ease: 'Bounce',
      duration: 1000,
      onComplete: (tween, targets) => {
        targets[0].play('spawn')
      }
    })
  }

  getCurrentDirection () {
    return this.currentDir
  }

  getCurrentPosition () {
    // console.log("am i called?")
    return new Phaser.Geom.Point(this.x, this.y)
  }

  increaseSpeed () {
    this.speed += 50
    this.threshold = this.speed / 60
    this.body.speed = (this.speed)
  }

  baseSpeed () {
    this.speed = 250
    this.threshold = this.speed / 60
    this.body.speed = (this.speed)
  }
}

export default Scuttles
