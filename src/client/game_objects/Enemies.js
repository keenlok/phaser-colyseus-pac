import Phaser from 'phaser'
import * as constants from '../../shared/config/constants'
import { START_COORD } from '../../shared/leveldata/NewLevelData'
// import seedrandom from 'seedrandom'
import Enemy from './Enemy'

class Enemies extends Phaser.GameObjects.Group {
  constructor (scene) {
    super(scene)
    // Phaser.GameObjects.Group.call(this, scene)
    this.classType = Enemy
    // TODO: Put the starting positions of the enemies to constants because the enemies'
    // spawn location is dependent on the map and it will become troublesome to keep changing
    // the numbers here
    this.enemy = this.create((START_COORD.A.x * constants.TileSize) + constants.CenterOffset,
      (START_COORD.A.y * constants.TileSize) + constants.CenterOffset, 'hermit_left', 'type1')
    this.enemy1 = this.create((START_COORD.B.x * constants.TileSize) + constants.CenterOffset,
      (START_COORD.B.y * constants.TileSize) + constants.CenterOffset, 'octo_left', 'type4')
    this.enemy2 = this.create((START_COORD.C.x * constants.TileSize) + constants.CenterOffset,
      (START_COORD.C.y * constants.TileSize) + constants.CenterOffset, 'jelly_left', 'type3')
    this.enemy3 = this.create((START_COORD.D.x * constants.TileSize) + constants.CenterOffset,
      (START_COORD.D.y * constants.TileSize) + constants.CenterOffset, 'hermit_left', 'type2')

    // this.enemytest = this.create(1000, 120, 'hermit_left', 'type1')
  }

  // update (time) {
  //   // this.children.iterate(child => child.update(time))
  // }
  //
  // attack () {
  // //   this.children.iterate(child => child.attack())
  // }
  // //
  // scatter () {
  // //   this.children.iterate(child => child.scatter())
  // }

  becomeScared () {
    this.children.iterate(child => child.enterFrightenedMode())
  }

  returnToNormal () {
    this.children.iterate(child => {
      child.returnToNormal()
      child.setTint()
      child.setAlpha()
    })
  }

  resetEnemies () {
    this.children.iterate(child => child.respawn())
  }

  disappears () {
    this.children.iterate(child => child.setVisible(false))
  }

  transitionEnemiesToNormal (flag) {
    this.children.iterate(child => {
      if (flag) {
        if (child.mode !== child.RETURNING_HOME) {
          child.setTint(0xFDF5E6)
          child.setAlpha(0.1)
        }
      } else {
        child.setTint()
        child.setAlpha()
      }
    })
  }

  increaseSpeed () {
    this.children.iterate(child => {
      child.enemyScatterSpeed += 50
      child.cruiseElroySpeed += 50
      child.enemySpeed += 50
      child.enemyFrightenedSpeed += 50
      child.TURNING_COOLDOWN -= 10
      child.RETURNING_COOLDOWN -= 10
    })
  }

  baseSpeed () {
    this.children.iterate(child => child.baseSpeed())
  }

  // setRandomNumberGenerator (seed) {
  //   this.children.iterate(child => {
  //     child.rng = seedrandom(seed)
  //   })
  // }

  getChildren () {
    return new Promise((resolve, reject) => {
      if (typeof this.enemy !== "undefined" && typeof this.enemy1 !== "undefined"
        && typeof this.enemy2 !== "undefined" && typeof this.enemy3 !== "undefined") {
        // console.log("Resolved")
        resolve(this.children)
      }
    })
  }
}

export default Enemies
