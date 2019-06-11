import Enemies from "./game_objects/Enemies"
import SpecialDots from './game_objects/SpecialDots'
import Players from './game_objects/Players'
import GameObjFactory from '../shared/factory/GameObjFactory'

function createEnemies(scene) {
  GameObjFactory.messageLog('Creating enemies')

  scene.enemies = new Enemies(scene)
  let promisedEnemies = scene.enemies.getChildren()

  let enemieslist = {}
  promisedEnemies.then((children) => {
    children.iterate(enemy => {
      enemieslist[enemy.name + enemy.type] = enemy
    })
    scene.enemieslist = enemieslist
    scene.enemy = scene.enemies.enemy
    GameObjFactory.messageLog('Enemies created')
  })
}

function createPlayers(scene) {
  GameObjFactory.messageLog('Creating player 1')

  scene.group = new Players(scene)
  // scene.scuttle = scene.group.scuttle
  // scene.scuttle.name = 'player1'
}

export function createPlayer2(scene) {
  GameObjFactory.messageLog('Creating player 2')

  return scene.group.createSecondScuttle()
}

function createSpecialFood(scene) {
  GameObjFactory.messageLog('Creating special food')

  scene.specialFood = new SpecialDots(scene)
}
export function createObjectsForHeadless(scene) {
  GameObjFactory.createMap(scene)
  createEnemies(scene)
  createPlayers(scene)
  createSpecialFood(scene)
  GameObjFactory.createAndConfigureCameras(scene)
  GameObjFactory.createCursors(scene)
}

