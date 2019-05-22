const SoundManager = require('../manager/SoundManager')

class SoundFactory {
  static createAllAudio (scene, soundCreator) {
    let soundManager = new SoundManager(scene, soundCreator)

    this.createBgm(soundManager, soundCreator)
    this.createVoiceOvers(soundManager, soundCreator)
    this.createSoundEffects(soundManager, soundCreator)

    return soundManager
  }

  static createSoundEffects (soundManager, soundCreator) {

    soundManager.walkingSfx = soundCreator.add('scuttling8', {volume: 1.3})

    soundManager.jellyPropelSfx = soundCreator.add('jellyPropel', {volume: 0.4})
    soundManager.sharkChompSfx = soundCreator.add('sharkChomp', {volume: 0.4})
    soundManager.octopusCamoSfx = soundCreator.add('octoCamo', {volume: 0.4})
    soundManager.octopusAppearSfx = soundCreator.add('octoAmbush', {volume: 0.4})
    soundManager.pufferSpeedSfx = soundCreator.add('pufferSpeed', {volume: 0.4})
    soundManager.pufferBoomSfx = soundCreator.add('pufferBoom', {volume: 0.4})
    soundManager.hermitStealSfx = soundCreator.add('hermitSteal', {volume: 0.4})

    soundManager.eatingSfx = soundCreator.add('eatFoodSfx', {volume: 2})
    soundManager.eatSpecialSfx = soundCreator.add('eatSpecialSfx', {volume: 0.4})
    soundManager.eatNormalSfx = soundCreator.add('eatNormalSfx', {volume: 0.2})
    soundManager.getEatenSfx = soundCreator.add('eatenSfx', {volume: 1.5})

    soundManager.hermitAlertSFX = soundCreator.add('hermitAlertSfx', {volume: 1.9})
    soundManager.genericAttackSFX = soundCreator.add('genericEnemyAttackSfx', {volume: 1})
    // scene.enemyEatsSFX = soundManager('genericEatAttack', {volume: 0.4})

    soundManager.changeToNormalSfx = soundCreator.add('normalModeSfx', {volume: 0.4})
    soundManager.changeToHuntSfx = soundCreator.add('huntModeSfx', {volume: 0.4})

    soundManager.growingSfx = soundCreator.add('growingSfx', {volume: 0.4})
    soundManager.popSfx = soundCreator.add('popSfx', {volume: 2})
    soundManager.growAndPopSfx = soundCreator.add('growNPopSfx', {volume: 2})
    soundManager.enemySpiritSfx = soundCreator.add('enemySpiritSfx', {volume: 0.4})
    soundManager.gameOverSfx = soundCreator.add('gameoverSfx', {volume: 2.9})
    soundManager.winSfx = soundCreator.add('winSfx', {volume: 2.9})
    soundManager.sharkChompSfx = soundCreator.add('sharkChompSfx', {volume: 0.4})

    soundManager.buttonSfx = soundCreator.add('buttonSfx', {volume: 2})
  }

  static createVoiceOvers (soundManager, soundCreator) {
    soundManager.scuttleVO = [5]
    for (let i = 1, j = 2; i <= 3; i++) {
      soundManager.scuttleVO[i - 1] = soundCreator.add('scuttleatVO0' + i, {volume: 1.9})
      if ((i + 2) < 5) {
        soundManager.scuttleVO[i + 2] = soundCreator.add('diesVO' + j++, {volume: 2.2})
      }
    }

    soundManager.enemyVO = []
    for (let i = 1; i <= 3; i++) {
      soundManager.enemyVO.push(soundCreator.add('enemyVO0' + i, {volume: 1.8}))
    }
  }

  static createBgm (soundManager, soundCreator) {
    soundManager.normalBGM = soundCreator.add('normalBGM')
    let loopMarker = {
      name: 'loop',
      start: 0,
      duration: 71.99997732426304,
      config: {
        volume: 0.9,
        loop: true
      }
    }
    soundManager.normalBGM.addMarker(loopMarker)

    soundManager.huntBGM = soundCreator.add('huntBGM')
    let loopHuntMarker = {
      name: 'huntLoop',
      start: 0,
      duration: 24,
      config: {
        volume: 0.9,
        loop: true
      }
    }
    soundManager.huntBGM.addMarker(loopHuntMarker)
  }
}

module.exports = SoundFactory
