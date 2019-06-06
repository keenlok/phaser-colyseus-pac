class EnemyState {
  constructor(enemy) {
    this.x =            enemy.x
    this.y =            enemy.y
    this.mode =         enemy.mode
    this.isFrightened = enemy.isFrightened
    this.isDead =       enemy.isDead
    this.destination =  enemy.ghostDestination
    this.currDir =      enemy.currentDir
  }
}

class PlayerState {
  constructor(player) {
    if (typeof player === 'undefined') {
      player = {
        x:        0,
        y:        0,
        currDir:  0,
        alive:    false,
        isDead:   true,
        isPowUp:  false,
        lives:    3
      }
    }
    this.init(player)

  }

  init(player) {
    this.x =        player.x
    this.y =        player.y
    this.currDir =  player.currentDir
    this.alive =    player.alive
    this.isDead =   player.isDead
    this.isPowUp =  player.isPowerUp
    this.lives =    player.lives
  }
}

export class State {
  constructor() {
    // this.scene = scene
    this.players = {}
    this.enemies = {}
  }

  updateEnemies(enemies) {
    if (typeof enemies === "undefined") {
      return
    }
    // GameRoom.messageLog("Setting/Updating enemy states")
    enemies.then((children) => {
      children.iterate(enemy => {
        // GameRoom.messageLog(enemy.name, enemy.type, enemy.x, enemy.y)
        this.enemies[enemy.name + enemy.type] = new EnemyState(enemy)
      })
    })
  }

  setPlayer(id, player) {
    console.log("Setting up!")
    this.players[id] = new PlayerState(player)
  }

  update() {

  }
}