import Phaser from 'phaser'
import * as constants from "../../../shared/config/constants"

export default class Preload extends Phaser.Scene {
  constructor(key) {
    super(key)
  }

  preload () {
    Preload.messageLog("Initialise: Preload")
    this.loadAssets()
  }

  static messageLog(...messages) {
    constants.messageLog('Game', messages)
  }

  /**  ----------  Start of preload methods --------- */
  loadAssets () {
    Preload.messageLog("Preload: Backgrounds")
    this.load.image('background', '../../public/assets/background-2x.png')

    Preload.messageLog("Preload: Dots")
    this.load.spritesheet('specialDot', '../../public/assets/dots.png', {
      frameHeight: 16,
      frameWidth: 16
    })

    Preload.messageLog("Preload: Sprites")
    this.loadSprites()
    // this.loadAudio()

    Preload.messageLog("Preload: Map")
    this.loadMap()
  }

  loadMap () {
    this.load.image('tile', '../../public/assets/map/final-extruded-again.png')
    this.load.image('foodTile', '../../public/assets/map/food.png')
    this.load.spritesheet('powerup', '../../public/assets/map/power-up-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.tilemapTiledJSON('newmap', '../../public/assets/map/map.json')

    this.load.image('coral', '../../public/assets/map/coral-small-v1.png')
  }

  loadSprites () {
    Preload.messageLog("Preload: Sprites: Scuttles")

    /** Scuttles spritesheets */
    this.load.spritesheet('scuttle', '../../public/assets/sprites/player/original/scuttle.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_die', '../../public/assets/sprites/player/original/crab-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_spawn', '../../public/assets/sprites/player/original/crab-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_wobble', '../../public/assets/sprites/player/original/crab-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    this.load.spritesheet('happy', '../../public/assets/sprites/player/original/superhappy.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    Preload.messageLog("Preload: Sprites: Enemies")
    this.loadEnemies()
  }

  loadEnemies () {
    Preload.messageLog("Preload: Sprites: Enemies: Commons")

    this.load.spritesheet('enemy_spawn', '../../public/assets/sprites/enemies/enemy-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('enemy_wobble', '../../public/assets/sprites/enemies/enemy-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('dead_spirit', '../../public/assets/sprites/enemies/glow-loop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.loadHermit()
    this.loadJelly()
    this.loadOctopus()
    this.loadShark()
  }

  loadHermit () {
    Preload.messageLog("Preload: Sprites: Enemies: Hermit")

    this.load.spritesheet('hermit_left', '../../public/assets/sprites/enemies/hermit/hermit-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_left', '../../public/assets/sprites/enemies/hermit/hermit-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_right', '../../public/assets/sprites/enemies/hermit/hermit-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_right', '../../public/assets/sprites/enemies/hermit/hermit-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_dying', '../../public/assets/sprites/enemies/hermit/hermit-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadJelly () {
    Preload.messageLog("Preload: Sprites: Enemies: Jelly")

    /** Jelly */
    this.load.spritesheet('jelly_left', '../../public/assets/sprites/enemies/jelly/jelly-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_right', '../../public/assets/sprites/enemies/jelly/jelly-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_left', '../../public/assets/sprites/enemies/jelly/jelly-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_right', '../../public/assets/sprites/enemies/jelly/jelly-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_dying', '../../public/assets/sprites/enemies/jelly/jelly-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadShark () {
    Preload.messageLog("Preload: Sprites: Enemies: Shark")

    /** shark */
    this.load.spritesheet('shark_left', '../../public/assets/sprites/enemies/shark/shark-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_right', '../../public/assets/sprites/enemies/shark/shark-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_left', '../../public/assets/sprites/enemies/shark/shark-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_right', '../../public/assets/sprites/enemies/shark/shark-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadOctopus () {
    Preload.messageLog("Preload: Sprites: Enemies: Octopus")

    /** octo */
    this.load.spritesheet('octo_left', '../../public/assets/sprites/enemies/octo/octo-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_right', '../../public/assets/sprites/enemies/octo/octo-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_left', '../../public/assets/sprites/enemies/octo/octo-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_right', '../../public/assets/sprites/enemies/octo/octo-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_dying', '../../public/assets/sprites/enemies/octo/octo-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }
  /**  ---------  End of preload methods ---------- */
}
