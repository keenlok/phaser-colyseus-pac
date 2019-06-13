import SpecialDots from './game_objects/specialDots'
import Players from './game_objects/players'
import GameObjFactory from '../../shared/factory/gameObjFactory'
import Enemies from "./game_objects/enemies"

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

function createSpecialFood(scene) {
  GameObjFactory.messageLog('Creating special food')

  scene.specialFood = new SpecialDots(scene)
}

function createPlayers(scene) {
  GameObjFactory.messageLog('Creating players group ')

  scene.group = new Players(scene)
  scene.players = {}
  // scene.scuttle = scene.group.scuttle
  // scene.scuttle.name = 'player1'
}

export function createPlayer(scene, id) {
  scene.players[id] = scene.group.createNewPlayer(id)
  return scene.players[id]
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