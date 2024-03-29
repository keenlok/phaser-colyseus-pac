import * as constants from '../../../shared/config/constants'
import * as levelData from '../../../shared/leveldata/newLevelData'
import Phaser from 'phaser'

const directions = constants.directions

class Enemy extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, type) {
    super(scene, x, y, texture)
    scene.physics.world.enable(this)
    scene.children.add(this)
    // ------- Trying stuff -------- //
    this.initializeVariables(x, y, texture, type)

    if (this.type !== 'type_shark') {
      // this.messageLog(this)
      this.createEgg()
      this.setVisible(false)
    }
    this.createAnimListener()
  }

  update (time) {
    let point = constants.convertToGridUnits(this.x, this.y)

    this.checkWarp()
    this.updateEnemyMode()
    // this is to check if it can turn
    let convertedPoint = constants.convertToPixels(point.x, point.y)
    // Do  not turn if object is not in grid
    if (constants.isInGrid(convertedPoint.x, this.x, convertedPoint.y, this.y, constants.THRESHOLD)) {
      this.directions = constants.updateDirections(this.scene, point.x, point.y)
      this.moveAccordingToMode(convertedPoint, point.x, point.y, time)
    }
    // this.isNear()
    // this.checkAnimFrame()
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
    this.messageLog('initializing')
  }

  setBehaviourType (type) {
    this.type = type

    switch (this.type) {
      case 'type1':
        this.scatterDestination = constants.convertToPixels(levelData.mapWidth, 0)
        this.safetiles = [constants.SAFE_TILE, constants.DOT_TILE]
        this.mode = this.AT_HOME
        this.start = levelData.START_COORD.A
        break
      case 'type2':
        this.scatterDestination = constants.convertToPixels(0, 0)
        this.start = levelData.START_COORD.D

        // this.move(this.currentDir)
        break
      case 'type3':
        this.scatterDestination = constants.convertToPixels(0, levelData.mapHeight)
        this.start = levelData.START_COORD.C
        break
      case 'type4':
        this.start = levelData.START_COORD.B
        break
      default:
        console.warn('INVALID ENEMY TYPE CREATED', this.type)
        break
    }

    this.currentDir = this.start.startDir

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
          // this.scene.soundManager.jellyPropelSfx.play()
        }
      }
    }, [], this)

    this.egg.on('animationcomplete', () => {
      if (this.egg.anims.currentAnim.key === 'enemy_spawn') {
        // this.scene.soundManager.popSfx.play()
        this.setVisible(true)
        this.egg.setVisible(false)
        this.scene.time.delayedCall(1000, this.resetEgg, [], this)
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
    this.messageLog("Respawning!")
    this.body.setVelocity(0)
    this.x = this.initX
    this.y = this.initY
    this.mode = this.AT_HOME
    this.isDead = false
    this.isAttacking = false
    this.setVisible(false)
    this.currentDir = this.start.startDir
    this.safetiles = [constants.SAFE_TILE]
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
    if (this.name === 'jelly' && (this.currentDir === directions.UP ||
      this.currentDir === directions.DOWN)) {
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
    this.previousDir = this.currentDir
    this.currentDir = direction
    let editedName = this.name + '_'
    this.blendMode = Phaser.BlendModes.NORMAL
    let animType = this.getCurrentAnimType(editedName)

    this.flipX = false

    if (this.currentDir === directions.NONE) {
      this.body.setVelocity(0, 0)
      return
    }

    let speed = this.getVelocity(direction)
    this.playRespectiveAnimation(direction, animType)

    this.setAngle(0)
    if (direction === directions.LEFT || direction === directions.RIGHT) {
      this.body.setVelocityX(speed)
    } else {
      if (this.name === 'jelly') {
        this.setAngle(90)
      }
      this.body.setVelocityY(speed)
    }
  }

  getVelocity (direction) {
    let speed = this.enemySpeed
    if (this.scene.getCurrentMode() === this.SCATTER) {
      speed = this.enemyScatterSpeed
    }
    if (this.mode === this.RANDOM) {
      speed = this.enemyFrightenedSpeed
    } else if (this.mode === this.RETURNING_HOME) {
      speed = this.cruiseElroySpeed
    } else {
      if (this.type === 'type1' && this.scene.numFoodEaten > (0.9 * levelData.numFood)) {
        speed = this.cruiseElroySpeed
        this.mode = this.CHASE
      }
    }
    if (direction === directions.LEFT || direction === directions.UP) {
      speed = -speed
    }
    return speed
  }

  playRespectiveAnimation (direction, animType) {
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

  getDestination () {
    let homePosition = this.getHomePosition()
    let destination
    let currentMode = this.scene.getCurrentMode()
    let targetInformation = this.scene.getTargetInformationForEnemy()
    // this.messageLog("What is mode", currentMode)
    // if (currentMode === this.SCATTER) {
    //   return this.scatterDestination
    // } else {
      switch (this.type) {
        case 'type1':
          destination = targetInformation.position
          if (typeof destination === 'undefined') {
            // console.warn('Destination is undefined')
            this.messageLog('Destination is undefined')

          }
          // this.messageLog("My destination", destination.x, destination.y)
          return destination
        case 'type2':

          destination = targetInformation.position
          // if (typeof destination === 'undefined') {
          //   // console.warn('Destination is undefined')
          //   this.messageLog('Destination is undefined')
          // }

          let direction = targetInformation.direction
          if (typeof direction === 'undefined') {
            this.messageLog("Direction is NONE, i'm stuck")
          }
          let offsetX = 0
          let offsetY = 0
          if (direction === directions.LEFT || direction === directions.RIGHT) {
            offsetX = (direction === directions.RIGHT) ? -4 : 4
          }
          if (direction === directions.UP || direction === directions.DOWN) {
            offsetY = (direction === directions.LEFT) ? -4 : 4
          }
          offsetX *= constants.TileSize
          offsetY *= constants.TileSize
          destination.x -= offsetX
          destination.y -= offsetY

          // Makes sure destination still within the map
          if (destination.x < constants.CenterOffset) {
            destination.x = constants.CenterOffset
          }
          if (destination.x > levelData.WIDTH - constants.CenterOffset) {
            destination.x = levelData.WIDTH - constants.CenterOffset
          }
          if (destination.y < constants.CenterOffset) {
            destination.y = constants.CenterOffset
          }
          if (destination.y > levelData.WIDTH - constants.CenterOffset) {
            destination.y = levelData.WIDTH - constants.CenterOffset
          }

          if (typeof destination === 'undefined') {
            // console.warn('Enemy cannot get destination', this.name)
            this.messageLog('Enemy cannot get destination', this.name)
          }

          if (this.mode === this.RETURNING_HOME) {
            // this.messageLog('will i reache here 10011001010100101010101010100101010101')
            destination = homePosition
          }
          // this.messageLog("My destination", destination.x, destination.y)
          return destination

        case 'type3':
          let pacmanPostion = targetInformation.position
          let sharkPosition = this.scene.enemy.getCurrentPosition()
          let diff = {
            x: pacmanPostion.x - sharkPosition.x,
            y: pacmanPostion.y - sharkPosition.y
          }
          destination = new Phaser.Geom.Point(pacmanPostion.x + diff.x, pacmanPostion.y + diff.y)
          if (typeof destination === 'undefined') {
            this.messageLog(destination, pacmanPostion, diff)
            // this.messageLog('oh no its a enemy')
          }
          // Makes sure destination still within the map
          if (destination.x < constants.CenterOffset) {
            destination.x = constants.CenterOffset
          }
          if (destination.x > levelData.WIDTH - constants.CenterOffset) {
            destination.x = levelData.WIDTH - constants.CenterOffset
          }
          if (destination.y < constants.CenterOffset) {
            destination.y = constants.CenterOffset
          }
          if (destination.y > levelData.WIDTH - constants.CenterOffset) {
            destination.y = levelData.WIDTH - constants.CenterOffset
          }
          // this.messageLog("My destination", destination.x, destination.y)
          return destination

        case 'type4':
          destination = targetInformation.position
          let bluePosition = this.getCurrentPosition()
          if (this.getDistance(bluePosition, destination) > 8 * constants.TileSize) {
            if (typeof destination === 'undefined') {
              this.messageLog('undefined?', destination, bluePosition)
            }
            // this.messageLog("My destination", destination.x, destination.y)
            return destination
          } else {
            return new Phaser.Geom.Point(this.scatterDestination.x, this.scatterDestination.y)
          }

        default:
          return new Phaser.Geom.Point(this.scatterDestination.x, this.scatterDestination.y)
      }
    // }
  }

  checkWarp () {
    this.x = Phaser.Math.Wrap(this.x, 0, levelData.WIDTH)
    this.y = Phaser.Math.Wrap(this.y, 0, levelData.HEIGHT)
  }

  updateEnemyMode () {
    if (this.isAttacking && (this.mode === this.SCATTER || this.mode === this.CHASE)) {
      this.ghostDestination = this.getDestination()
      this.mode = this.CHASE
    }

    if (this.scene.isPaused) {
      this.mode = this.STOP
      this.setVisible(false)
    }
  }

  moveAccordingToMode (point, x, y, time) {
    let possibleExits = []
    let canContinue = this.checkPossibleExits(possibleExits)

    switch (this.mode) {
      case this.RANDOM:
        if (this.turnTimer < time) {
          this.moveRandomly(possibleExits, x, y)
          this.turnTimer = time + this.RANDOM_COOLDOWN
        }
        break
      case this.RETURNING_HOME:
        this.returnHome(time, possibleExits, x, y)
        break
      case this.CHASE:
        this.moveToDestination(time, possibleExits, x, y)
        break
      case this.AT_HOME:
        this.atHome(canContinue, x, y)
        break
      case this.EXIT_HOME:
        this.exitHome(canContinue, x, y)
        // this.messageLog('time to get yr ass out ol here')
        break
      case this.SCATTER:
        this.ghostDestination = new Phaser.Geom.Point(this.scatterDestination.x,
          this.scatterDestination.y)
        this.mode = this.CHASE
        // this.messageLog('scatter')
        break
      case this.STOP:
        this.move(directions.NONE)
        // this.messageLog('stop')
        break
    }
  }

  checkPossibleExits (possibleExits) {
    let canContinue
    if (this.directions[this.currentDir] === null && this.directions[this.opposites[this.currentDir]] !== null) {
      canContinue = true
      possibleExits.push(this.currentDir)
    } else {
      canContinue = this.checkSafetile(this.directions[this.currentDir])
      for (let i = 1; i < this.directions.length; i++) {
        if (this.checkSafetile(this.directions[i]) && i !== this.opposites[this.currentDir]) {
          possibleExits.push(i)
        }
      }
    }
    return canContinue
  }

  returnHome (time, possibleExits, x, y) {
    if (this.turnTimer < time) {
      this.ghostDestination = new Phaser.Geom.Point(this.initX, this.initY)
      this.moveToTarget(possibleExits, x, y)
      this.turnTimer = time + this.RETURNING_COOLDOWN
    }
    if (constants.isInGrid(this.x, this.initX, this.y, this.initY, constants.THRESHOLD)) {
      // this.scene.soundManager.enemySpiritSfx.stop()
      this.body.setVelocity(0)
      this.resetPosition(x, y)
      this.returnToNormal()
      this.safetiles = [constants.SAFE_TILE]
      // this.messageLog(this)
      this.scene.giveExitOrder(this)
    }
  }

  moveToDestination (time, possibleExits, x, y) {
    if (this.turnTimer < time) {
      if (typeof this.ghostDestination === 'undefined') {
        this.messageLog('error 404 impending in updateEnemyMode: ', this.ghostDestination)
      }
      // this.messageLog('Moving here,',this.ghostDestination.x, this.ghostDestination.y)
      this.moveToTarget(possibleExits, x, y)
      this.turnTimer = time + this.TURNING_COOLDOWN
      if (x === 3 && y === 10) {
        // this.messageLog(this.currentDir)
        // this.messageLog('why am i stuck here,', possibleExits)
      }
    }
  }

  moveRandomly (possibleExits, x, y) {
    let select
    if (typeof this.rng === 'undefined') {
      select = Math.floor(Math.random() * possibleExits.length)
    } else {
      select = Math.floor(this.rng() * possibleExits.length)
    }
    let newDirection = possibleExits[select]

    this.checkAbilityToTurn(newDirection, x, y)
    this.move(newDirection)
  }

  checkAbilityToTurn (newDirection, x, y) {
    if (newDirection !== this.currentDir) {
      this.scene.events.emit('changeDir', newDirection, this.type)
      // Sets the position of the enemy in place before letting it move
      this.resetPosition(x, y)
    }
  }

  moveToTarget (possibleExits, x, y) {
    let distanceToTarget = 999999
    let direction, decision, bestDecision

    for (let i = 0; i < possibleExits.length; i++) {
      direction = possibleExits[i]
      switch (direction) {
        case directions.LEFT:
          decision = constants.convertToPixels((x - 1), y)
          break
        case directions.RIGHT:
          decision = constants.convertToPixels((x + 1), y)
          break
        case directions.UP:
          decision = constants.convertToPixels(x, y - 1)
          break
        case directions.DOWN:
          decision = constants.convertToPixels(x, y + 1)
          break
        default:
          break
      }
      if (typeof this.ghostDestination === 'undefined' || typeof decision === 'undefined') {
        this.messageLog('error impending in moveToTarget: ', this.ghostDestination, decision)
      }
      let dist = this.getDistance(this.ghostDestination, decision)
      if (dist < distanceToTarget) {
        bestDecision = direction
        distanceToTarget = dist
      }
    }

    // If the enemy is currently on the special tile, don't allow it to go up,
    // according to the article
    // if (bestDecision === directions.UP) {
    //   // if (this.name === 'shark') {
    //   //   this.messageLog(x, y)
    //   //   this.messageLog(this.scene.isSpecialTile({x: x, y: y}))
    //   // } //For Debug remove if needed
    //   if (this.scene.isSpecialTile({x: x, y: y}) && bestDecision === directions.UP) {
    //     bestDecision = this.currentDir
    //     let canContinue = this.checkSafetile(this.directions[this.currentDir])
    //     if (!canContinue) {
    //       // this.messageLog('do something')
    //     }
    //   }
    // }
    // only resets the position if it is going to turn
    this.checkAbilityToTurn(bestDecision, x, y)
    this.move(bestDecision)
  }

  atHome (canContinue, x, y) {
    this.setVisible(false)
    this.body.setVelocity(0)
    // if (!canContinue) {
    //   // this.messageLog('what is this ', x, y)
    //   this.resetPosition(x, y)
    //   // this is to make the enemy bounce around in their humble abode
    //   let dir = (this.currentDir === directions.UP) ? directions.DOWN : directions.UP
    //   this.move(dir)
    // } else {
    //   this.move(this.currentDir)
    // }
  }

  exitHome (canContinue, x, y) {
    if (this.body.speed === 0) {
      this.messageLog("Exiting home", this.currentDir)
      this.move(this.currentDir)
    }
    this.safetiles = [constants.SAFE_TILE]
    if (!this.isHome(x, y)) {
      // (this.currentDir === directions.UP && y === directions.GHOST_HOUSE.EXIT.y - 1) {
      // If the sprite is out of the box let it move out
      this.messageLog("Left home", this.currentDir, this.x, this.y)
      this.resetPosition(x, y)
      this.safetiles = [constants.SAFE_TILE, constants.DOT_TILE]
      this.mode = this.scene.getCurrentMode()
      if (this.mode === this.CHASE) {
        this.isAttacking = true
      }
      if (this.mode === this.RANDOM && this.prevMode !== this.AT_HOME) {
        this.mode = this.prevMode
      }
      this.messageLog(this.name + ' ' + this.mode)
    }
  }

  checkSafetile (tile) {
    if (tile !== null && typeof tile !== 'undefined') {
      for (let i = 0; i < this.safetiles.length; i++) {
        if (tile.index === this.safetiles[i]) {
          return true
        }
      }
    }
  }

  getDistance (a, b) {
    if (typeof a === 'undefined' || typeof b === 'undefined') {
      this.messageLog('error impending', a, b)
    }
    let c = Math.pow((a.x - b.x), 2)
    let d = Math.pow((a.y - b.y), 2)
    let result = Math.sqrt(c + d)
    return result
  }

  isHome (x, y) {
    return !(x < levelData.GHOST_HOUSE.MIN.x * constants.TileSize ||
      x > levelData.GHOST_HOUSE.MAX.x * constants.TileSize ||
      y < levelData.GHOST_HOUSE.MIN.y * constants.TileSize ||
      y > levelData.GHOST_HOUSE.MAX.y * constants.TileSize)
  }

  scatter () {
    if (this.mode !== this.RETURNING_HOME && this.mode !== this.AT_HOME) {
      // this.messageLog('currently moving in ', this.currentDir)
      this.isAttacking = false
      if (this.mode !== this.AT_HOME && this.mode !== this.EXIT_HOME) {
        this.mode = this.SCATTER
      }
    }
  }

  attack () {
    if (this.mode !== this.RETURNING_HOME && this.mode !== this.AT_HOME) {
      this.isAttacking = true
      this.alreadyTriggered = false
      this.messageLog('this is current attacking in this direction ', this.currentDir)
      if (this.mode !== this.AT_HOME && this.mode !== this.EXIT_HOME) {
        this.currentDir = this.opposites[this.currentDir]
      }
    }
  }

  enterFrightenedMode () {
    this.isFrightened = true
    if (this.mode !== this.EXIT_HOME && this.mode !== this.RETURNING_HOME &&
      this.mode !== this.AT_HOME) {
      this.messageLog("am frightened")
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

  dies(player) {
    this.scene.events.emit('eat_enemy', this, player)
    // this.scene.soundManager.playEnemyDeathSFX()
    // this.scene.soundManager.scuttleVO[1].play()
    let score = this.scene.increaseScore('enemy_exp', player)
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
          // if (!this.scene.soundManager.popSfx.isPlaying) {
            // this.scene.soundManager.playAlertSound()
            this.alreadyTriggered = true
          // }
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
