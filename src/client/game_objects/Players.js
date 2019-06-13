import Phaser from 'phaser'
import * as constants from '../../shared/config/constants'
import * as levelData from '../../shared/leveldata/NewLevelData'

const directions = constants.directions

class Players extends Phaser.GameObjects.Group {
  constructor (scene) {
    super(scene)
    this.classType = Player
  }

  createNewPlayer(id) {
    let point = levelData.PLAYER_START[0]
    if (point.isTaken) {
      point = levelData.PLAYER_START[1]
    }
    let startPoint = constants.convertToPixels(point.x, point.y)
    let player = this.create(startPoint.x, startPoint.y, 'scuttle')
    point.isTaken = true
    player.id = id
    return player
  }

  returnToNormal() {
    this.children.iterate(child => {
      child.returnToNormal()
    })
  }
}

class Player extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, type, frame) {
    super(scene, x, y, 'scuttle')
    scene.physics.world.enable(this)
    scene.children.add(this)
    this.initVar(x, y)

    this.body.setSize(constants.TileSize, constants.TileSize)
    // constants.CenterOffset, constants.CenterOffset)
    console.log("scuttle's body ", this.body)
    // this.move( directions.LEFT)

    this.createEgg(x, y)
    this.createAnimCompleteListeners()
    this.egg.anims.delayedPlay(Math.random() * 1000, 'egg')
  }

  initVar(x, y) {
    this.spawnPosition = {x: x, y: y}
    this.directions = [null, null, null, null, null]
    this.opposites = [
      directions.NONE, directions.RIGHT, directions.LEFT,
      directions.DOWN, directions.UP
    ]

    this.baseSpeed() // Threshold is basically the speed / game frame rate
    this.marker = new Phaser.Geom.Point()
    this.turnPoint = new Phaser.Geom.Point()
    this.currentDir = directions.NONE
    this.turning = directions.NONE
    this.lives = 3
    this.count = 1
    this.isDead = false
    this.isPowerUp = false

    this.alive = false
    this.score = 0
    // this.test_coolDown = 2000

    console.log(`this is its initial x and y ${this.x} ${this.y}`)
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
        // if (this.lives === 3) {
        //   this.scene.resetEnemies()
        // }
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

  move (direction) {
    // if (direction === directions.NONE) {
    //   this.body.setVelocity(0, 0)
    //   return
    // }
    let speed = this.speed
    let animType = 'move'
    if (this.isPowerUp) {
      animType = 'move_hunt'
      if (!this.scene.isHuntMode) {
        console.warn('ERROR: SCUTTLE ANIMATION IS WRONG')
      }
    }

    this.setAngle(0)

    this.play(animType, true)
    if (direction ===  directions.LEFT) {
      // this.play(animType + '_left')
      this.flipX = false
    } else if (direction ===  directions.RIGHT) {
      // this.play(animType + '_right')
      this.flipX = true
    }

    this.currentDir = direction
  }

  doCelebratoryAction () {
    console.log('did it even reach here?', this)
    let fireworks = []
    for (let i = 0; i < 5; i++) {
      fireworks.push(this.scene.add.sprite(this.x, this.y, 'enemy_spawn'))
    }
    console.log(fireworks)
    for (let i = 0; i < fireworks.length; i++) {
      console.log(fireworks[i])
      let num = Math.random() * ((this.scene.sys.game.config.width) - 80)
      num *= Math.pow(-1, i)
      console.log(num)
      this.scene.tweens.add({
        targets: fireworks[i],
        x: num,
        y: num,
        duration: 2000,
        ease: 'Sine.easeOut',
        onComplete: (tweens, target) => {
          console.log('hello')
          target[0].play('enemy_spawn')
          target[0].on('animationcomplete', () => {
            target[0].destroy()
          }, [], target[0])
        }
      })
    }
  }

  powerUp () {
    this.isPowerUp = true
    this.play('move_hunt')
    if (this.currentDir ===  directions.LEFT || this.currentDir ===  directions.UP) {
      this.flipX = false
    } else {
      this.flipX = true
    }
  }

  returnToNormal () {
    this.play('move', false)
    this.isPowerUp = false
  }

  // the necessary adjustments when scuttle dies
  dies () {
    this.body.setVelocity(0)

    // This isDead flag is to prevent multiple calls(?) for the code below
    if (!this.isDead) {
      console.log("This is called! SCUTTLE DIES")
      this.nextDirection =  directions.NONE
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
    // if (this.lives >= 0) {
    //   this.scene.time.delayedCall(500, this.scene.restartGame, [this], this.scene)
    // }
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
    this.scene.soundManager.growAndPopSfx.play()
    this.currentDir =  directions.NONE
    this.nextDirection =  directions.NONE
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

  /** Trying new stuff for ghosts movement */
  getCurrentDirection () {
    return this.currentDir
  }

  getCurrentPosition () {
    // console.log("am i called?")
    return new Phaser.Geom.Point(this.x, this.y)
  }

  // playMovingSfx () {
  //   // let num = Math.round(Math.random() * 7) + 1
  //   // this.scene.walkingSfx[num - 1].play()
  //   this.scene.
  // }

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

export default Players
