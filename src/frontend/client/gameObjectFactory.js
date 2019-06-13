import SpecialDots from './game_objects/specialDots'
import Players from './game_objects/players'
import CommonObjectFactory from '../../shared/factory/gameObjFactory'
import Enemies from "./game_objects/enemies"

export default class GameObjectFactory extends CommonObjectFactory {
 static createEnemies(scene) {
  super.messageLog('Creating enemies')

  scene.enemies = new Enemies(scene)
  let promisedEnemies = scene.enemies.getChildren()

  scene.enemieslist = {}
  promisedEnemies.then((children) => {
    children.iterate(enemy => {
      scene.enemieslist[enemy.name + enemy.type] = enemy
    })
    GameObjectFactory.messageLog('Enemies created')
  })
}

 static createSpecialFood(scene) {
  super.messageLog('Creating special food')

  scene.specialFood = new SpecialDots(scene)
}

 static createPlayers(scene) {
  super.messageLog('Creating players group ')

  scene.group = new Players(scene)
  scene.players = {}
  // scene.scuttle = scene.group.scuttle
  // scene.scuttle.name = 'player1'
  }

  static createPlayer(scene, id) {
    scene.players[id] = scene.group.createNewPlayer(id)
    return scene.players[id]
  }


  static createAllGameObjects(scene) {
    super.createMap(scene)
    this.createEnemies(scene)
    this.createPlayers(scene)
    this.createSpecialFood(scene)
    super.createAndConfigureCameras(scene)
    super.createScoreAndText(scene)
    super.createCursors(scene)
  }

}