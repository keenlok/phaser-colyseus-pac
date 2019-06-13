import {AUTO} from 'phaser'

import ClientGame from './clientgame'
import Boot from './scenes/Boot'
import GameOver from './scenes/GameOver'
import Menu from './scenes/Menu'
import PauseScreen from './scenes/PauseScreen'
import Preload from './scenes/Preload'
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

