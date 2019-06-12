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

function createSpecialFood(scene) {
  GameObjFactory.messageLog('Creating special food')

  scene.specialFood = new SpecialDots(scene)
}

function createPlayers(scene) {
  GameObjFactory.messageLog('Creating players group')

  scene.group = new Players(scene)
  scene.players = {}
  // scene.scuttle = scene.group.scuttle
  // scene.scuttle.name = 'player1'
}

export function createPlayer(scene, id) {
  GameObjFactory.messageLog('Creating new player')
  let group = scene.group
  // if (group === null) {
  //   let promise = new Promise((resolve, reject) => {
  //     let interval = setInterval(() => {
  //       if (scene.group !== null) {
  //         clearInterval(interval)
  //         resolve(scene.group)
  //       }
  //     }, 1)
  //   })
  //   group = await promise
  // }
  scene.players[id] = group.createNewPlayer(id)
  console.log("How many players after creation?", Object.keys(scene.players).length)
  return scene.players[id]
}

export function createPlayer2(scene) {
  GameObjFactory.messageLog('Creating player 2')

  return scene.group.createSecondScuttle()
}

export function createObjectsForHeadless(scene) {
  GameObjFactory.createMap(scene)
  createEnemies(scene)
  createPlayers(scene)
  createSpecialFood(scene)
  GameObjFactory.createAndConfigureCameras(scene)
  GameObjFactory.createCursors(scene)
}

