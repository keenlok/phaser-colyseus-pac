import Phaser from 'phaser'
import * as constants from '../../shared/config/constants'
import {specialFood} from '../../shared/leveldata/NewLevelData'

class SpecialDots extends Phaser.GameObjects.Group {
  constructor (scene) {
    super(scene)
    Phaser.GameObjects.Group.call(this, scene)
    this.classType = SpecialDot
    this.createPowerUps(specialFood)
  }

  createPowerUps (specialFood) {
    for (let i = 0; i < specialFood.length; i++) {
      let point = constants.convertToPixels(specialFood[i].x, specialFood[i].y)
      this.create(point.x, point.y, 'powerup')
    }
  }

  reEnableChildren () {
    this.children.iterate(child => { child.setVisible(true) })
  }
}

class SpecialDot extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture) {
    super(scene)
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture)
    scene.physics.world.enable(this)
    scene.children.add(this)
    this.play('powerup')
    this.body.setSize(constants.TileSize, constants.TileSize)
    // this.scene.tweens.add({
    //   targets: this,
    //   blendMode: Phaser.BlendModes.NORMAL,
    //   duration: 500,
    //   yoyo: true,
    //   hold: 500,
    //   repeatDelay: 500,
    //   repeat: -1
    // })
  }
}

export default SpecialDots
