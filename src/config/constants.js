const Phaser = require('phaser')

// map and tiles
// const TileSize = 16
const TileSize = 80
// const CenterOffset = 8
const CenterOffset = 40
const THRESHOLD = 12
const SAFE_TILE = -1
const DOT_TILE = 0

// const WIDTH = 448
// const HEIGHT = 496

// direction controls
const NONE = 0
const LEFT = 1
const RIGHT = 2
const UP = 3
const DOWN = 4

const directions = {NONE, LEFT, RIGHT, UP, DOWN}

const isInGrid = (x1, x2, y1, y2, threshold) => {
  return (Phaser.Math.Fuzzy.Equal(x1, x2, threshold) &&
  Phaser.Math.Fuzzy.Equal(y1, y2, threshold))
}

const updateDirections = (scene, cx, cy) => {
  let newDirections = [5]
  newDirections[0] = null
  newDirections[1] = scene.getTileAtMap(cx - 1, cy)
  newDirections[2] = scene.getTileAtMap(cx + 1, cy)
  newDirections[3] = scene.getTileAtMap(cx, cy - 1)
  newDirections[4] = scene.getTileAtMap(cx, cy + 1)
  return newDirections
}

// convert to "world units" / pixels
const convertToPixels = (x, y) => {
  let cx = x * TileSize + CenterOffset
  let cy = y * TileSize + CenterOffset
  return new Phaser.Geom.Point(cx, cy)
}

// To convert from pixels to the grid/map number/units
const convertToGridUnits = (x, y) => {
  let cx = Phaser.Math.Snap.Floor(Math.floor(x), TileSize) / TileSize
  let cy = Phaser.Math.Snap.Floor(Math.floor(y), TileSize) / TileSize
  return new Phaser.Geom.Point(cx, cy)
}

let DEBUG = false
if (process.env.NODE_ENV === 'development') {
  DEBUG = true
}

module.exports = {
  TileSize,
  CenterOffset,
  THRESHOLD,
  SAFE_TILE,
  DOT_TILE,
  directions,
  isInGrid,
  updateDirections,
  convertToPixels,
  convertToGridUnits,
  DEBUG
}
