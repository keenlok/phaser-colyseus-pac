class AnimationFactory {
  static createAllAnimations (animationManager) {
    this.createAnimationForScuttles(animationManager)
    this.createAnimationForEnemies(animationManager)
    this.createAnimationForSpecialFood(animationManager)
  }

  static createAnimationForScuttles (manager) {
    manager.create({
      key: 'move',
      frames: manager.generateFrameNumbers('scuttle', { start: 0, end: 20 }),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'move_hunt',
      frames: manager.generateFrameNumbers('scuttle', { start: 24, end: 39 }),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'egg',
      frames: manager.generateFrameNumbers('scuttle_wobble', { start: 0, end: 10 }),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'spawn',
      frames: manager.generateFrameNumbers('scuttle_spawn', { start: 0, end: 16 }),
      frameRate: 20
    })
    manager.create({
      key: 'dying',
      frames: manager.generateFrameNumbers('scuttle_die', { start: 0, end: 26 }),
      frameRate: 20
    })
    manager.create({
      key: 'happy',
      frames: manager.generateFrameNumbers('happy', {start: 0, end: 0}),
      frameRate: 20
    })
  }

  static createAnimationForEnemies (manager) {
    this.createCommonAnimationsForEnemy(manager)
    this.createAnimationForHermit(manager)
    this.createAnimationForShark(manager)
    this.createAnimationForJelly(manager)
    this.createAnimationForOcto(manager)
  }

  static createCommonAnimationsForEnemy (manager) {
    manager.create({
      key: 'dead_spirit',
      frames: manager.generateFrameNumbers('dead_spirit', {start: 0, end: 19}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'enemy_egg',
      frames: manager.generateFrameNumbers('enemy_wobble', {start: 0, end: 24}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'enemy_spawn',
      frames: manager.generateFrameNumbers('enemy_spawn', {start: 0, end: 17}),
      frameRate: 10
    })
  }

  static createAnimationForHermit (manager) {
    manager.create({
      key: 'hermit_left',
      frames: manager.generateFrameNumbers('hermit_left', {start: 0, end: 20}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'hermit_right',
      frames: manager.generateFrameNumbers('hermit_right', {start: 0, end: 20}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'hermit_hunt_left',
      frames: manager.generateFrameNumbers('hermit_hunt_left', {start: 0, end: 8}),
      frameRate: 16,
      repeat: -1
    })
    manager.create({
      key: 'hermit_hunt_right',
      frames: manager.generateFrameNumbers('hermit_hunt_right', {start: 0, end: 8}),
      frameRate: 16,
      repeat: -1
    })
    manager.create({
      key: 'hermit_dying',
      frames: manager.generateFrameNumbers('hermit_dying', {start: 0, end: 31}),
      frameRate: 20
    })
  }

  static createAnimationForShark (manager) {
    manager.create({
      key: 'shark_left',
      frames: manager.generateFrameNumbers('shark_left', {start: 0, end: 15}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'shark_right',
      frames: manager.generateFrameNumbers('shark_right', {start: 0, end: 15}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'shark_hunt_left',
      frames: manager.generateFrameNumbers('shark_hunt_left', {start: 0, end: 14}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'shark_hunt_right',
      frames: manager.generateFrameNumbers('shark_hunt_right', {start: 0, end: 14}),
      frameRate: 20,
      repeat: -1
    })
  }

  static createAnimationForOcto (manager) {
    manager.create({
      key: 'octo_left',
      frames: manager.generateFrameNumbers('octo_left', {start: 0, end: 20}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'octo_right',
      frames: manager.generateFrameNumbers('octo_right', {start: 0, end: 20}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'octo_hunt_left',
      frames: manager.generateFrameNumbers('octo_hunt_left', {start: 0, end: 11}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'octo_hunt_right',
      frames: manager.generateFrameNumbers('octo_hunt_right', {start: 0, end: 11}),
      frameRate: 20,
      repeat: -1
    })
    manager.create({
      key: 'octo_dying',
      frames: manager.generateFrameNumbers('octo_dying', {start: 0, end: 35}),
      frameRate: 20
    })
  }

  static createAnimationForJelly (manager) {
    manager.create({
      key: 'jelly_left',
      frames: manager.generateFrameNumbers('jelly_left', {start: 0, end: 16}),
      frameRate: 20,
      repeat: -1,
      repeatDelay: 500
    })
    manager.create({
      key: 'jelly_right',
      frames: manager.generateFrameNumbers('jelly_right', {start: 0, end: 16}),
      frameRate: 20,
      repeat: -1,
      repeatDelay: 500
    })
    manager.create({
      key: 'jelly_hunt_left',
      frames: manager.generateFrameNumbers('jelly_hunt_left', {start: 0, end: 11}),
      frameRate: 20,
      repeat: -1,
      repeatDelay: 500
    })
    manager.create({
      key: 'jelly_hunt_right',
      frames: manager.generateFrameNumbers('jelly_hunt_right', {start: 0, end: 11}),
      frameRate: 20,
      repeat: -1,
      repeatDelay: 500
    })
    manager.create({
      key: 'jelly_dying',
      frames: manager.generateFrameNumbers('jelly_dying', {start: 0, end: 35}),
      frameRate: 20
    })
  }

  static createAnimationForSpecialFood (manager) {
    manager.create({
      key: 'powerup',
      frames: manager.generateFrameNumbers('powerup', {start: 0, end: 14}),
      frameRate: 20,
      repeat: -1
    })
  }
}

module.exports = AnimationFactory
