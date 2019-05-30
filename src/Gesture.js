import Phaser from 'phaser'
import * as constants from './config/constants'

/**
 * Maybe if we want to have more gestures can add on.
 * Source here: https://www.emanueleferonato.com/2018/02/09/phaser-3-version-of-the-html5-swipe-controlled-sokoban-game/
 */

export function endSwipe (event) {
  // Variables used for dragging in phaser
  let swipeTime = event.upTime - event.downTime
  let swipe = new Phaser.Geom.Point(event.upX - event.downX, event.upY - event.downY)
  let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe)
  let swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude)

  if (swipeMagnitude > 20 && swipeTime < 1000 &&
    (Math.abs(swipeNormal.x) < 0.8 || Math.abs(swipeNormal.y) > 0.8)) {
    if (swipeNormal.x > 0.8) {
      this.checkMoves(constants.RIGHT)
      console.log('swiping right')
    }
    if (swipeNormal.x < -0.8) {
      this.checkMoves(constants.LEFT)
      console.log('swiping left')
    }
    if (swipeNormal.y > 0.8) {
      this.checkMoves(constants.DOWN)
      console.log('swiping down')
    }
    if (swipeNormal.y < -0.8) {
      this.checkMoves(constants.UP)
      console.log('swiping up')
    }
  }
}
