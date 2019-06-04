const levelData = require('../leveldata/NewLevelData')

class PhysicsFactory {
  constructor (scene, physics) {
    this.scene = scene
    this.physics = physics
  }

  setupPhysicsForRelevantObjects (player, enemies, specialFood) {
    let scene = this.scene
    this.setupCollisionForMaps(scene.tileLayer, scene.coralLayer)
    this.setupPhysicsForPlayer(player, enemies, specialFood)
    this.setupPhysicsForEnemies(enemies)
  }

  setupPhysicsForPlayer (player, enemies, specialFood) {
    let scene = this.scene
    // console.log('what is this', this.physics.add.collider)
    // console.log(scene.tileLayer, scene.coralLayer)
    // For collision with tiles and coral tree
    this.physics.add.collider(player, scene.tileLayer)
    this.physics.add.collider(player, scene.coralLayer)

    // For eating food
    this.physics.add.overlap(player, scene.foodLayer, scene.eatFood, scene.canPlayerEat, scene)

    // For eating specialFood
    specialFood.iterate(child => {
      this.physics.add.overlap(player, child, scene.eatBiggerCoin, scene.isOverlapping, scene)
    })

    // For eating / getting eaten by enemies
    enemies.iterate(child => {
      this.physics.add.overlap(player, child, child.crabEatCrab, scene.isOverlapping, child)
    })

    // console.log(this.physics.colliders)
  }

  setupPhysicsForEnemies (enemies) {
    enemies.iterate(child => {
      this.physics.add.collider(child, this.scene.tileLayer)
    })
  }

  setupCollisionForMaps (tileLayer, coralLayer) {
    tileLayer.setCollisionBetween(1, 140, true)
    coralLayer.setCollisionBetween(levelData.startGid, levelData.endGid, true)
  }
}

module.exports = PhysicsFactory
