class ScoreManager {
  constructor (scene) {
    this.scene = scene

    this.SPECIAL_FOOD_SCORE = 50
    this.ENEMY_SCORE = 100
    this.NORMAL_FOOD_SCORE = 10
    this.BASE_MULTIPLIER = 1

    this.resetMultiplier()
    this.resetScore()
  }

  resetMultiplier () {
    this.multiplier = this.BASE_MULTIPLIER
  }

  resetScore () {
    this.score = 0
  }

  getScoreForEnemyKill () {
    return Math.pow(2, this.multiplier++) * this.ENEMY_SCORE
  }

  increaseScore (key) {
    // console.log(key)
    let increase
    switch (key) {
      case 'specialfood':
        increase = this.SPECIAL_FOOD_SCORE
        break
      case 'enemy_exp':
        increase = this.getScoreForEnemyKill()
        break
      case 'normalfood':
        increase = this.NORMAL_FOOD_SCORE
        break
      default:
        console.log('invalid score type', key)
        break
    }
    this.score += increase
    this.scene.updateScoreUI(increase)
    // console.log('what is the increase, in SM', increase)
    return increase
  }
}

module.exports = ScoreManager
