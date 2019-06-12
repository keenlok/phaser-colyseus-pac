import Phaser from 'phaser'
// import { GameTwoPlayers from 'src/frontend/Game'

export default class Preload extends Phaser.Scene {
  constructor () {
    super({key: 'preload'})
    // console.log('Preloading')
  }

  preload () {
    let cx = this.sys.game.config.width
    let cy = this.sys.game.config.height
    let haha = this.cache.json.get('loading')

    // let haha = this.cache.html
    // let dada = haha.get('loading')
    console.log(haha)
    this.loadAssets()
    this.createProgressbar(cx / 2, cy / 2)
  }

  loadAssets () {
    this.load.image('background', '/static/assets/background-2x.png')
    this.load.spritesheet('specialDot', '/static/assets/dots.png', {
      frameHeight: 16,
      frameWidth: 16
    })

    // this.load.spritesheet('scuttle', '/static/assets/spritesheetV1.png', { frameWidth: 126, frameHeight: 60 })
    this.loadSprites()
    this.loadAudio()
    this.loadMap()
  }
  loadMap () {
    this.load.image('tile', '/static/assets/map/final-extruded-again.png')
    this.load.image('foodTile', '/static/assets/map/food.png')
    this.load.spritesheet('powerup', '/static/assets/map/power-up-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.tilemapTiledJSON('newmap', '/static/assets/map/map.json')

    this.load.image('coral', '/static/assets/map/coral-small-v1.png')
  }

  loadSprites () {
    /** Scuttles spritesheets */
    this.load.spritesheet('scuttle', '/static/assets/sprites/player/original/scuttle.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_die', '/static/assets/sprites/player/original/crab-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_spawn', '/static/assets/sprites/player/original/crab-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_wobble', '/static/assets/sprites/player/original/crab-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    this.load.spritesheet('happy', '/static/assets/sprites/player/original/superhappy.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    this.loadEnemies()
  }

  loadEnemies () {
    this.load.spritesheet('enemy_spawn', '/static/assets/sprites/enemies/enemy-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('enemy_wobble', '/static/assets/sprites/enemies/enemy-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('dead_spirit', '/static/assets/sprites/enemies/glow-loop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.loadHermit()
    this.loadJelly()
    this.loadOctopus()
    this.loadShark()
  }

  loadHermit () {
    /** Hermit */
    this.load.spritesheet('hermit_left', '/static/assets/sprites/enemies/hermit/hermit-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_left', '/static/assets/sprites/enemies/hermit/hermit-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_right', '/static/assets/sprites/enemies/hermit/hermit-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_right', '/static/assets/sprites/enemies/hermit/hermit-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_dying', '/static/assets/sprites/enemies/hermit/hermit-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadJelly () {
    /** Jelly */
    this.load.spritesheet('jelly_left', '/static/assets/sprites/enemies/jelly/jelly-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_right', '/static/assets/sprites/enemies/jelly/jelly-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_left', '/static/assets/sprites/enemies/jelly/jelly-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_right', '/static/assets/sprites/enemies/jelly/jelly-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_dying', '/static/assets/sprites/enemies/jelly/jelly-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadShark () {
    /** shark */
    this.load.spritesheet('shark_left', '/static/assets/sprites/enemies/shark/shark-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_right', '/static/assets/sprites/enemies/shark/shark-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_left', '/static/assets/sprites/enemies/shark/shark-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_right', '/static/assets/sprites/enemies/shark/shark-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadOctopus () {
    /** octo */
    this.load.spritesheet('octo_left', '/static/assets/sprites/enemies/octo/octo-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_right', '/static/assets/sprites/enemies/octo/octo-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_left', '/static/assets/sprites/enemies/octo/octo-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_right', '/static/assets/sprites/enemies/octo/octo-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_dying', '/static/assets/sprites/enemies/octo/octo-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadAudio () {
    this.loadSFX()
    this.load.audio('huntBGM', '/static/assets/audio/bgm_gameplay_hunt.wav')
    this.load.audio('normalBGM', '/static/assets/audio/bgm_gameplay_normal.wav')
    this.load.audio('enemyVO01', '/static/assets/audio/vo_generic_enemy_01.wav')
    this.load.audio('enemyVO02', '/static/assets/audio/vo_generic_enemy_02.wav')
    this.load.audio('enemyVO03', '/static/assets/audio/vo_generic_enemy_03.wav')
    this.load.audio('diesVO2', '/static/assets/audio/vo_crab_dies_02.wav')
    this.load.audio('diesVO3', '/static/assets/audio/vo_crab_dies_03.wav')
    this.load.audio('scuttleatVO01', '/static/assets/audio/vo_crab_eats_01.wav')
    this.load.audio('scuttleatVO02', '/static/assets/audio/vo_crab_eats_02.wav')
    this.load.audio('scuttleatVO03', '/static/assets/audio/vo_crab_eats_03.wav')
  }

  loadSFX () {
    this.load.audio('eatenSfx', '/static/assets/audio/ui_crab_eaten.wav')
    this.load.audio('eatFoodSfx', '/static/assets/audio/ui_crab_eat.wav')

    this.load.audio('growingSfx', '/static/assets/audio/sfx_crab_pop_growing.wav')
    this.load.audio('popSfx', '/static/assets/audio/sfx_crab_pop_only.wav')
    this.load.audio('growNPopSfx', '/static/assets/audio/sfx_crab_pop.wav')
    this.load.audio('enemySpiritSfx', '/static/assets/audio/sfx_enemy_spirit.wav')
    this.load.audio('gameoverSfx', '/static/assets/audio/sfx_gameover.wav')
    this.load.audio('winSfx', '/static/assets/audio/sfx_win.wav')
    this.load.audio('sharkChompSfx', '/static/assets/audio/sfx_shark_chomp.wav')

    this.load.audio('scuttling8', '/static/assets/audio/ui_crab_move_08.wav')
    this.load.audio('eatSpecialSfx', '/static/assets/audio/ui_crab_eats_special_powers.wav')
    this.load.audio('eatNormalSfx', '/static/assets/audio/ui_crab_eats_normal.wav')
    this.load.audio('normalModeSfx', '/static/assets/audio/sfx_normal_mode.wav')
    this.load.audio('huntModeSfx', '/static/assets/audio/sfx_hunt_mode.wav')
    this.load.audio('hermitAlertSfx', '/static/assets/audio/sfx_hermit_alert.wav')

    this.load.audio('jellyPropel', '/static/assets/audio/sfx_jellyfish_propel.wav')
    this.load.audio('sharkChomp', '/static/assets/audio/ui_shark_chomp.wav')
    this.load.audio('octoCamo', '/static/assets/audio/ui_octopus_camouflage.wav')
    this.load.audio('octoAmbush', '/static/assets/audio/sfx_octopus_appear.wav')
    this.load.audio('pufferSpeed', '/static/assets/audio/ui_pufferfish_speed_burst.wav')
    this.load.audio('pufferBoom', '/static/assets/audio/ui_pufferfish_explode.wav')
    this.load.audio('hermitSteal', '/static/assets/audio/sfx_hermit_steal.wav')
    this.load.audio('genericEnemyAttackSfx', '/static/assets/audio/sfx_generic_enemy_attack.wav')

    this.load.audio('buttonSfx', '/static/assets/audio/ui_generic_button.wav')
  }

  createProgressbar (x, y) {
    // size & position
    let width = 400
    let height = 20
    let xStart = x - width / 2
    let yStart = y - height / 2

    // border size
    let borderOffset = 2

    let borderRect = new Phaser.Geom.Rectangle(
      xStart - borderOffset,
      yStart - borderOffset,
      width + borderOffset * 2,
      height + borderOffset * 2)

    let border = this.add.graphics({
      lineStyle: {
        width: 5,
        color: 0xaaaaaa
      }
    })
    border.strokeRectShape(borderRect)

    let progressbar = this.add.graphics()

    /**
     * Updates the progress bar.
     *
     * @param {number} percentage
     */
    let updateProgressbar = function (percentage) {
      progressbar.clear()
      progressbar.fillStyle(0xffffff, 1)
      progressbar.fillRect(xStart, yStart, percentage * width, height)
    }

    this.load.on('progress', updateProgressbar)
    this.load.once('complete', function () {
      this.load.off('progress', updateProgressbar)
      this.scene.start('preload_screen')
    }, this)
  }
}
