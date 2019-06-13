export default class SoundManager {
  constructor (scene, soundManager) {
    this.scene = scene
    this.sound = soundManager
    this.SFXTimer = 0
    this.soundDelay = 200
  }

  resetTimer (time) {
    this.SFXTimer = time
  }

  // Play burp sound, then the spirit sound as shown in Sharon's video
  playEnemyDeathSFX () {
    this.eatingSfx.play()
    this.scuttleVO[1].play()
    this.eatingSfx.on('ended', () => {
      this.enemySpiritSfx.play({repeat: -1})
    })
  }

  playScuttleSFX (currentTime) {
    if (this.SFXTimer < currentTime) {
      this.walkingSfx.play()
    }
    // this.tileFlag = !this.tileFlag
    this.SFXTimer += this.soundDelay
  }

  playNormalBgm (key, config) {
    this.normalBGM.play(key, config)
  }

  playAlertSound () {
    this.hermitAlertSFX.play()
    this.genericAttackSFX.play()
  }

  playPopSound () {

  }

  doTransitionToHuntFromNormal () {
    this.changeToHuntSfx.play()
    this.normalBGM.pause()
    this.huntBGM.play('huntLoop')
  }

  doTransitionToNormalFromHunt () {
    this.huntBGM.stop()
    this.changeToNormalSfx.play()
    this.normalBGM.resume()
  }

  playScuttleDiesSequenceOne (num) {
    this.getEatenSfx.play()
    this.enemyVO[num - 1].play()
    let num1 = Math.round(Math.random()) + 2
    this.scuttleVO[num1 + 1].play({delay: 0.65})
  }

  playScuttleDiesSequenceTwo (num) {
    this.getEatenSfx.play()
    let num1 = Math.round(Math.random()) + 2
    this.scuttleVO[num1 + 1].play({delay: 0.35})
    this.enemyVO[num - 1].play({delay: 0.8})
  }

  playGameOverSequence () {
    this.gameOverSfx.play()
    this.gameOverSfx.on('ended', () => {
      // soundFadeIn(this.scene.get('gameover'), this.normalBGM, 2000, 1, 0)
      this.normalBGM.setVolume(0.9)
    })
    // this.normalBGM.stop()
  }

  playWinSequence () {
    this.winSfx.play()
    this.winSfx.on('ended', () => {
      // console.log(this.normalBGM)
      // soundFadeIn(this, this.normalBGM, 1000, 0.9, 0)
      this.normalBGM.setVolume(0.9)
      // this.normalBGM.play('loop')
      console.log(this.normalBGM)
    })
  }

  setBgmVolume (volume) {
    this.normalBGM.setVolume(volume)
  }

  playButtonSoundEffect () {
    this.buttonSfx.play()
  }

  playEatFoodEffect () {
    this.eatNormalSfx.play()
  }
}
