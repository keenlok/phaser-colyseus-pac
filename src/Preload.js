// import Phaser from 'phaser'
// import { GameTwoPlayers from 'src/frontend/Game'

export default class Preload extends Phaser.Scene {
  constructor () {
    super({key: 'preload'})
    console.log('Preloading')
  }

  preload () {
    let cx = this.sys.game.config.width
    let cy = this.sys.game.config.height
    // let haha = this.cache.json.get('loading')

    // let haha = this.cache.html
    // let dada = haha.get('loading')
    // console.log(haha)
    this.loadAssets()
    this.createProgressbar(cx / 2, cy / 2)
  }

  loadAssets () {
    this.load.image('background', './public/assets/background-2x.png')
    this.load.spritesheet('specialDot', './public/assets/dots.png', {
      frameHeight: 16,
      frameWidth: 16
    })

    // this.load.spritesheet('scuttle', './public/assets/spritesheetV1.png', { frameWidth: 126, frameHeight: 60 })
    this.loadSprites()
    this.loadAudio()
    this.loadMap()
  }
  loadMap () {
    this.load.image('tile', './public/assets/map/final-extruded-again.png')
    this.load.image('foodTile', './public/assets/map/food.png')
    this.load.spritesheet('powerup', './public/assets/map/power-up-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.tilemapTiledJSON('newmap', './public/assets/map/map.json')

    this.load.image('coral', './public/assets/map/coral-small-v1.png')
  }

  loadSprites () {
    /** Scuttles spritesheets */
    this.load.spritesheet('scuttle', './public/assets/sprites/player/original/scuttle.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_die', './public/assets/sprites/player/original/crab-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_spawn', './public/assets/sprites/player/original/crab-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('scuttle_wobble', './public/assets/sprites/player/original/crab-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    this.load.spritesheet('happy', './public/assets/sprites/player/original/superhappy.png', {
      frameWidth: 160,
      frameHeight: 160
    })

    this.loadEnemies()
  }

  loadEnemies () {
    this.load.spritesheet('enemy_spawn', './public/assets/sprites/enemies/enemy-pop.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('enemy_wobble', './public/assets/sprites/enemies/enemy-wobble.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('dead_spirit', './public/assets/sprites/enemies/glow-loop.png', {
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
    this.load.spritesheet('hermit_left', './public/assets/sprites/enemies/hermit/hermit-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_left', './public/assets/sprites/enemies/hermit/hermit-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_right', './public/assets/sprites/enemies/hermit/hermit-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_hunt_right', './public/assets/sprites/enemies/hermit/hermit-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('hermit_dying', './public/assets/sprites/enemies/hermit/hermit-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadJelly () {
    /** Jelly */
    this.load.spritesheet('jelly_left', './public/assets/sprites/enemies/jelly/jelly-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_right', './public/assets/sprites/enemies/jelly/jelly-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_left', './public/assets/sprites/enemies/jelly/jelly-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_hunt_right', './public/assets/sprites/enemies/jelly/jelly-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('jelly_dying', './public/assets/sprites/enemies/jelly/jelly-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadShark () {
    /** shark */
    this.load.spritesheet('shark_left', './public/assets/sprites/enemies/shark/shark-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_right', './public/assets/sprites/enemies/shark/shark-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_left', './public/assets/sprites/enemies/shark/shark-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('shark_hunt_right', './public/assets/sprites/enemies/shark/shark-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadOctopus () {
    /** octo */
    this.load.spritesheet('octo_left', './public/assets/sprites/enemies/octo/octo-left-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_right', './public/assets/sprites/enemies/octo/octo-right-normal.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_left', './public/assets/sprites/enemies/octo/octo-left-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_hunt_right', './public/assets/sprites/enemies/octo/octo-right-hunt.png', {
      frameWidth: 160,
      frameHeight: 160
    })
    this.load.spritesheet('octo_dying', './public/assets/sprites/enemies/octo/octo-death.png', {
      frameWidth: 160,
      frameHeight: 160
    })
  }

  loadAudio () {
    this.loadSFX()
    this.load.audio('huntBGM', './public/assets/audio/bgm_gameplay_hunt.wav')
    this.load.audio('normalBGM', './public/assets/audio/bgm_gameplay_normal.wav')
    this.load.audio('enemyVO01', './public/assets/audio/vo_generic_enemy_01.wav')
    this.load.audio('enemyVO02', './public/assets/audio/vo_generic_enemy_02.wav')
    this.load.audio('enemyVO03', './public/assets/audio/vo_generic_enemy_03.wav')
    this.load.audio('diesVO2', './public/assets/audio/vo_crab_dies_02.wav')
    this.load.audio('diesVO3', './public/assets/audio/vo_crab_dies_03.wav')
    this.load.audio('scuttleatVO01', './public/assets/audio/vo_crab_eats_01.wav')
    this.load.audio('scuttleatVO02', './public/assets/audio/vo_crab_eats_02.wav')
    this.load.audio('scuttleatVO03', './public/assets/audio/vo_crab_eats_03.wav')
  }

  loadSFX () {
    this.load.audio('eatenSfx', './public/assets/audio/ui_crab_eaten.wav')
    this.load.audio('eatFoodSfx', './public/assets/audio/ui_crab_eat.wav')

    this.load.audio('growingSfx', './public/assets/audio/sfx_crab_pop_growing.wav')
    this.load.audio('popSfx', './public/assets/audio/sfx_crab_pop_only.wav')
    this.load.audio('growNPopSfx', './public/assets/audio/sfx_crab_pop.wav')
    this.load.audio('enemySpiritSfx', './public/assets/audio/sfx_enemy_spirit.wav')
    this.load.audio('gameoverSfx', './public/assets/audio/sfx_gameover.wav')
    this.load.audio('winSfx', './public/assets/audio/sfx_win.wav')
    this.load.audio('sharkChompSfx', './public/assets/audio/sfx_shark_chomp.wav')

    this.load.audio('scuttling8', './public/assets/audio/ui_crab_move_08.wav')
    this.load.audio('eatSpecialSfx', './public/assets/audio/ui_crab_eats_special_powers.wav')
    this.load.audio('eatNormalSfx', './public/assets/audio/ui_crab_eats_normal.wav')
    this.load.audio('normalModeSfx', './public/assets/audio/sfx_normal_mode.wav')
    this.load.audio('huntModeSfx', './public/assets/audio/sfx_hunt_mode.wav')
    this.load.audio('hermitAlertSfx', './public/assets/audio/sfx_hermit_alert.wav')

    this.load.audio('jellyPropel', './public/assets/audio/sfx_jellyfish_propel.wav')
    this.load.audio('sharkChomp', './public/assets/audio/ui_shark_chomp.wav')
    this.load.audio('octoCamo', './public/assets/audio/ui_octopus_camouflage.wav')
    this.load.audio('octoAmbush', './public/assets/audio/sfx_octopus_appear.wav')
    this.load.audio('pufferSpeed', './public/assets/audio/ui_pufferfish_speed_burst.wav')
    this.load.audio('pufferBoom', './public/assets/audio/ui_pufferfish_explode.wav')
    this.load.audio('hermitSteal', './public/assets/audio/sfx_hermit_steal.wav')
    this.load.audio('genericEnemyAttackSfx', './public/assets/audio/sfx_generic_enemy_attack.wav')

    this.load.audio('buttonSfx', './public/assets/audio/ui_generic_button.wav')
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
      this.scene.start('maingame')
    }, this)
  }
}
