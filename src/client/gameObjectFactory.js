import SpecialDots from './game_objects/SpecialDots'
import Players from './game_objects/Players'
import GameObjFactory from '../shared/factory/GameObjFactory'
import Enemies from "./game_objects/Enemies"

function createEnemies(scene) {
  GameObjFactory.messageLog('Creating enemies')

  scene.enemies = new Enemies(scene)
  let promisedEnemies = scene.enemies.getChildren()

  scene.enemieslist = {}
  promisedEnemies.then((children) => {
    children.iterate(enemy => {
      scene.enemieslist[enemy.name + enemy.type] = enemy
    })
    GameObjFactory.messageLog('Enemies created')
  })
}

function createPlayers(scene) {
  GameObjFactory.messageLog('Creating player 1')

  scene.group = new Players(scene)
  // scene.scuttle = scene.group.scuttle
  // scene.scuttle.name = 'player1'
}

function createSpecialFood(scene) {
  GameObjFactory.messageLog('Creating special food')

  scene.specialFood = new SpecialDots(scene)
}


export function createAllGameObjects(scene) {
  GameObjFactory.createMap(scene)
  createEnemies(scene)
  createPlayers(scene)
  createSpecialFood(scene)
  GameObjFactory.createAndConfigureCameras(scene)
  GameObjFactory.createScoreAndText(scene)
  GameObjFactory.createCursors(scene)
}

export function createMiniMap(scene) {
  GameObjFactory.createMiniMap(scene)
}