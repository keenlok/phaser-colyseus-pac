import Phaser from 'phaser'
// import EasyStar from 'easystarjs'

import * as constants from './config/constants'

class Game extends Phaser.Scene {
  constructor () {
    // Phaser.Scene.call(this, { key: 'maingame' })
    super({ key: 'maingame' })
    this.initializeVariables()
  }

  initializeVariables () {
    // map and tiles
    this.map = null
    this.tileset = null
    this.scuttle = null
    this.cursors = null
    this.emptyTile = constants.SAFE_TILE
    this.dotTile = constants.DOT_TILE
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
    // pathFinding
    this.easyStar = null
    this.numFoodEaten = 0
  }

  createDebug () {
    const shapeGraphics = this.add.graphics()
    this.tileLayer.renderDebug(shapeGraphics)
    shapeGraphics.visible = false
    // this.gui.add(shapeGraphics, 'visible').listen()
    // shapeGraphics.visible = !shapeGraphics.visible
    // })
  }

  // setupCollidersForPlayer (player) {
  //   console.log('using old method')
  //   this.physics.add.collider(player, this.tileLayer)
  //   this.physics.add.collider(player, this.coralLayer)
  //   this.physics.add.overlap(player, this.foodLayer, this.eatFood, this.canPlayerEat, this)
  // }

  // createEasyStar () {
  //   // eslint-disable-next-line new-cap
  //   this.easyStar = new EasyStar.js()
  //
  //   let grid = []
  //
  //   // console.log(`This map size is :${this.map.height} ${this.map.width} `);
  //
  //   for (let i = 0; i < this.map.height; i++) {
  //     let col = []
  //     for (let j = 0; j < this.map.width; j++) {
  //       let tileID = this.map.getTileAt(j, i)
  //       // console.log(tileID)
  //       if (tileID.index === constants.SAFE_TILE || tileID.index === constants.DOT_TILE || tileID.index === 33) {
  //         col.push(1)
  //       } else {
  //         col.push(0)
  //       }
  //     }
  //     grid.push(col)
  //   }
  //
  //   // console.table(grid);
  //   this.easyStar.setGrid(grid)
  //   this.easyStar.setAcceptableTiles([1])
  //   //  console.log(`2.4: ${Math.round(2.4)}, 2.5: ${Math.round(2.5)}, 2.6: ${Math.round(2.6)}`);
  //   this.isOver = false
  // }

  createAnimations () {
  }

  createAudio () {
  }
}

export default Game
