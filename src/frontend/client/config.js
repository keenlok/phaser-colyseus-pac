import {AUTO} from 'phaser'

import ClientGame from './clientGame'
import Boot from './scenes/boot'
import GameOver from './scenes/gameOver'
import Menu from './scenes/menu'
import PauseScreen from './scenes/pauseScreen'
import Preload from './scenes/preload'
import * as constants from '../../shared/config/constants'


const config = {
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: constants.DEBUG
    }
  },
  scene: [Boot, Preload, Menu, ClientGame, PauseScreen, GameOver]
}

export default config

