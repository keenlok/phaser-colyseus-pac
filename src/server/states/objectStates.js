class EnemyState {
  constructor(enemy) {
    this.x =            enemy.x
    this.y =            enemy.y
    this.mode =         enemy.mode
    this.isFrightened = enemy.isFrightened
    this.isDead =       enemy.isDead
    this.currDir =      enemy.currentDir
    this.velocityX =    enemy.body.velocity.x
    this.velocityY =    enemy.body.velocity.y
  }
}

class PlayerState {
  constructor(player) {
    if (typeof player === 'undefined') {
      console.log("Did it come here")
      player = {
        x:        0,
        y:        0,
        currDir:  0,
        alive:    false,
        isDead:   true,
        isPowUp:  false,
        lives:    3,
        body: {
          velocity: {
            x: 0,
            y: 0
          }
        }
      }
    }
    this.init(player)

  }

  init(player) {
    // console.log(player.x, player.y)
    this.x =          player.x
    this.y =          player.y
    this.currDir =    player.currentDir
    this.alive =      player.alive
    this.isDead =     player.isDead
    this.isPowUp =    player.isPowerUp
    this.lives =      player.lives
    this.velocityX =  player.body.velocity.x
    this.velocityY =  player.body.velocity.y
  }
}

class World {
  constructor(sceneData) {
    if (typeof sceneData === 'undefined') {
      this.score = 0
      // this.player = null
      // this.enemies = null
      this.currentTimeMode = 0
      this.isPaused = false
    } else {
      this.score =            sceneData.score
      this.currentTimeMode =  sceneData.currentMode
      this.isPaused =         sceneData.isPaused
      this.isHuntMode =       sceneData.isHuntMode
    }
  }
}

export class State {
  constructor() {
    // this.scene = scene
    this.players = {}
    this.enemies = {}
    this.world = new World()
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

  updatePlayer(id, player) {
    // console.log("Update player")
    this.players[id] = new PlayerState(player)
  }

  updateWorld(scene) {
    this.world = new World(scene)
  }
}