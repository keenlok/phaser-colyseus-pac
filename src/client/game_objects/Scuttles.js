import Phaser from 'phaser'
import * as constants from '../../shared/config/constants'
import * as levelData from '../../shared/leveldata/NewLevelData'

const directions = constants.directions

class Scuttles extends Phaser.GameObjects.Group {
  constructor (scene) {
    super(scene)
    // Phaser.GameObjects.Group.call(this, scene)
    this.classType = Scuttle
    this.createScuttles()
    // console.log(scene)
    // console.log('player 191919919191919991919119991919991119191919')
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

  // getNumberOfScuttlesPlaying (playerList) {
  //   console.log('player 191919919191919991919119991919991119191919')
  //   for (let i = 0; i < playerList.length; i++) {
  //     console.log('18181818181818181818818188181818 what is thy i here?')
  //     console.log(playerList[i])
  //     this.create((15 * constants.TileSize) + constants.CenterOffset,
  //       (18 * constants.TileSize) + constants.CenterOffset, 'scuttle')
  //   }
  // }

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
       directions.NONE,  directions.RIGHT,  directions.LEFT,
       directions.DOWN,  directions.UP
    ]

    this.baseSpeed() // Threshold is basically the speed / game frame rate
    this.marker = new Phaser.Geom.Point()
    this.turnPoint = new Phaser.Geom.Point()
    this.currentDir =  directions.NONE
    this.turning =  directions.NONE
    this.lives = 3
    this.count = 1
    this.isDead = false
    this.isPowerUp = false

    this.alive = false
    this.test_coolDown = 2000

    console.log(`this is its initial x and y ${this.x} ${this.y}`)

    this.body.setSize(constants.TileSize, constants.TileSize)
    // constants.CenterOffset, constants.CenterOffset)
    console.log("scuttle's body ", this.body)
    // this.move( directions.LEFT)

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

  // checkDirection (turnTo) {
  //   if ((this.turning === turnTo && this.turning === this.currentDir) ||
  //     (this.directions[turnTo] !== null &&
  //       this.directions[turnTo].index !== constants.SAFE_TILE &&
  //       this.directions[turnTo].index !== constants.DOT_TILE)) {
  //     return
  //   }
  //
  //   if (this.currentDir === this.opposites[turnTo]) {
  //     this.move(turnTo)
  //   } else {
  //     this.turning = turnTo
  //
  //     this.turnPoint = constants.convertToPixels(this.marker.x, this.marker.y)
  //   }
  // }
  //
  // turn () {
  //   let cx = Math.floor(this.x)
  //   let cy = Math.floor(this.y)
  //
  //   if (constants.isInGrid(cx, this.turnPoint.x, cy, this.turnPoint.y, this.threshold)) {
  //     this.x = this.turnPoint.x
  //     this.y = this.turnPoint.y
  //
  //     this.body.reset(this.turnPoint.x, this.turnPoint.y)
  //
  //     this.move(this.turning)
  //
  //     this.turning =  directions.NONE
  //
  //     return true
  //   }
  //
  //   return false
  // }

  move (direction) {
    if (direction === directions.NONE) {
      this.body.setVelocity(0, 0)
    }
    let speed = this.speed
    let animType = 'move'
    if (this.isPowerUp) {
      animType = 'move_hunt'
      if (!this.scene.isHuntMode) {
        console.warn('ERROR: SCUTTLE ANIMATION IS WRONG')
      }
    }

    if (direction ===  directions.LEFT || direction ===  directions.UP) {
      speed = -speed
    }

    if (direction ===  directions.LEFT || direction ===  directions.RIGHT) {
      this.body.setVelocityX(speed)
      this.body.setVelocityY(0)
    } else if (direction === directions.UP || direction === directions.DOWN) {
      this.body.setVelocityY(speed)
      this.body.setVelocityX(0)
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
  //
  // gestureControl (direction) {
  //   if (this.alive) {
  //     if (this.count === 1 && (direction !==  directions.NONE)) {
  //       // this.scene.ghosts.startMoving()
  //       this.move(direction)
  //       this.count++
  //     }
  //     this.nextDirection = direction
  //     this.cheaperControls(direction)
  //   }
  // }

  // control (cursors) {
  //   if (this.alive) {
  //     if (this.count === 1 && (cursors.LEFT.isDown || cursors.RIGHT.isDown ||
  //       cursors.UP.isDown || cursors.DOWN.isDown)) {
  //       // this.scene.ghosts.startMoving()
  //       this.move( directions.LEFT)
  //       this.count++
  //     }
  //
  //     if (cursors.LEFT.isDown || cursors.A.isDown) {
  //       this.nextDirection =  directions.LEFT
  //       this.cheaperControls(this.nextDirection)
  //     } else if (cursors.RIGHT.isDown || cursors.D.isDown) {
  //       this.nextDirection =  directions.RIGHT
  //       this.cheaperControls(this.nextDirection)
  //     } else if (cursors.UP.isDown || cursors.W.isDown) {
  //       this.nextDirection =  directions.UP
  //       this.cheaperControls(this.nextDirection)
  //     } else if (cursors.DOWN.isDown || cursors.S.isDown) {
  //       this.nextDirection =  directions.DOWN
  //       this.cheaperControls(this.nextDirection)
  //     } else {
  //       this.continueMoving()
  //     }
  //     if (cursors.SPACE.isDown) {
  //       if (constants.DEBUG) {
  //         if (this.testTimer < this.scene.time.now) {
  //           console.log('do something')
  //           this.play('happy')
  //           this.scene.tweens.add({
  //             targets: this,
  //             y: '-=80',
  //             duration: 100,
  //             onComplete: (tween, target) => {
  //               console.log('hello? 1')
  //               target[0].scene.tweens.add({
  //                 targets: target[0],
  //                 angle: 360,
  //                 duration: 500,
  //                 onComplete: (tween, target) => {
  //                   console.log('hello? 2')
  //                   target[0].scene.tweens.add({
  //                     targets: target[0],
  //                     y: '+=80',
  //                     duration: 100,
  //                     onComplete: (tween, target) => {
  //                       target[0].doCelebratoryAction()
  //                     }
  //                   })
  //                 }
  //               })
  //             }
  //           })
  //           this.testTimer += this.test_coolDown
  //         }
  //       }
  //     }
  //   }
  // }

  // continueMoving () {
  //   this.cheaperControls(this.nextDirection)
  // }

  // storeDirectionToMove (direction) {
  //   this.nextDirection = direction
  //   this.cheaperControls(this.nextDirection)
  // }

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

  // cheaperControls (direction) {
  //   if (!this.scene.alreadyStarted && (direction ===  directions.LEFT ||
  //     direction ===  directions.RIGHT || direction ===  directions.UP ||
  //     direction ===  directions.DOWN)) {
  //     this.move( directions.LEFT)
  //     this.scene.alreadyStarted = true
  //   }
  //
  //   this.marker = constants.convertToGridUnits(this.x, this.y)
  //
  //   this.directions = constants.updateDirections(this.scene, this.marker.x, this.marker.y)
  //
  //   this.cheaperCheckKeys(direction)
  //
  //   if (this.turning !==  directions.NONE) {
  //     this.turn()
  //   }
  //
  //   this.checkWarp()
  // }

  // cheaperCheckKeys (direction) {
  //   if (direction ===  directions.LEFT && this.currentDir !==  directions.LEFT) {
  //     // console.log('left')
  //     this.checkDirection( directions.LEFT)
  //   } else if (direction ===  directions.RIGHT && this.currentDir !==  directions.RIGHT) {
  //     // console.log('right')
  //     this.checkDirection( directions.RIGHT)
  //   } else if (direction ===  directions.DOWN && this.currentDir !==  directions.DOWN) {
  //     // console.log('down')
  //     this.checkDirection( directions.DOWN)
  //   } else if (direction ===  directions.UP && this.currentDir !==  directions.UP) {
  //     // console.log('up')
  //     this.checkDirection( directions.UP)
  //   } else {
  //     this.turning =  directions.NONE
  //   }
  // }

  // the necessary adjustments when scuttle dies
  dies () {
    this.body.setVelocity(0)

    // This isDead flag is to prevent multiple calls(?) for the code below
    if (!this.isDead) {
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

  // scuttle moves by itself to destination point
  /**
   * MAY BE ABLE TO USE THE WAY GHOSTS MOVE TO AUTOMATICALLY MOVE PACMAN SO
   * THAT WE DONT HAVE TO RELY ON BUGGY EASYSTAR
   */
  // transitionLevel () {
  //   let destination = { x: 26, y: 14 }
  //   //  console.log(destination);
  //   if (this.currentPos.x === destination.x && this.currentPos.y === destination.y) {
  //     this.body.setVelocity(this.SPEED, 0)
  //     this.stopFinding = true
  //   }
  //   let currTile = { x: Phaser.Math.Snap.To(this.x, 16, 8), y: Phaser.Math.Snap.To(this.y, 16, 8) }
  //   if (!this.stopFinding) {
  //     // false if found a path (for now if not will keep printing)
  //     // impt for now as without this will cause error as in the end blue coord is equal to end coord
  //     // path[1] will be undefined as path will be an empty array.
  //     this.scene.easyStar.findPath(this.currentPos.x, this.currentPos.y, destination.x, destination.y, path => {
  //       console.log('current path: ' + path[0].x, path[0].y) // the current location
  //       console.log('current path : my coord in pixels : ' + this.x, this.y)
  //       //  console.log(path);
  //       if (path.length === 0) {
  //         //  console.log("become true");
  //         this.stopFinding = true
  //         return
  //       }
  //       let currX = path[0].x // for clarity to write like that
  //       let currY = path[0].y
  //       let nextX = path[1].x
  //       let nextY = path[1].y
  //       let diffX = nextX - currX
  //       let diffY = nextY - currY
  //
  //       if (diffX === 1) {
  //         // move to the right
  //         this.y = currTile.y
  //         this.setAngle(0)
  //         this.x += this.dist // changing position of blue enemy by dist every update loop
  //         this.currentPos.x = Math.floor((this.x - 8) / 16) // giving speed to blueEnemy essentially
  //       } else if (diffX === -1) {
  //         // move to the left
  //         this.y = currTile.y
  //         this.setAngle(180)
  //         this.x -= this.dist
  //         this.currentPos.x = Math.ceil((this.x - 8) / 16)
  //       } else if (diffY === 1) { // move to the down
  //         this.x = currTile.x
  //         this.setAngle(90)
  //         this.y += this.dist
  //         this.currentPos.y = Math.floor((this.y - 8) / 16)
  //       } else if (diffY === -1) { // move to the up
  //         this.x = currTile.x
  //         this.setAngle(270)
  //         this.y -= this.dist
  //         this.currentPos.y = Math.ceil((this.y - 8) / 16)
  //       }
  //       console.log('what my diff : ' + (diffY === 1 ? 'down' : 'up'))
  //       console.log('my coord in pixels : ' + this.x, this.y)
  //       console.log(this.currentPos)
  //     })
  //     this.scene.easyStar.calculate()
  //   }
  // }

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

export default Scuttles
