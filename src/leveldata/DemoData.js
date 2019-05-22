// This file contains the data that is tied to the map, like the locations
// that the charcter will spawn at, the tiles that are for the ghost house,
// the food tiles etc.

// This file is required for Demo.json to work properly
const constants = require('../config/constants')
const directions = constants.directions
const TileSize = constants.TileSize

const mapWidth = 21
const mapHeight = 21

const WIDTH = TileSize * mapWidth
const HEIGHT = TileSize * mapHeight

const PLAYER_START = {
  x: 10,
  y: 15
}

let houseTiles = []
let startGid = 166
let endGid = 190
for (let i = startGid; i <= endGid; i++) {
  houseTiles.push(i)
}

const GHOST_HOUSE = {
  MAX: {
    x: 14,
    y: 22
  },
  MIN: {
    x: 10,
    y: 18
  },
  EXIT: {
    x: 12,
    y: 18
  },
  TILES: houseTiles
}

const FoodTiles = [191, 192]

// const ENEMIES = [
//   'hermit'
// ]

const START_COORD = {
  A: {
    x: 11,
    y: 8,
    startDir: directions.UP,
    exit: {
      x: 0,
      y: 0
    }
  },
  B: {
    x: 12,
    y: 11,
    startDir: directions.RIGHT,
    exit: {
      x: 0,
      y: 0
    }
  },
  C: {
    x: 8,
    y: 10,
    startDir: directions.LEFT,
    exit: {
      x: 9,
      y: 22
    }
  },
  D: {
    x: 10,
    y: 10,
    startDir: directions.UP,
    exit: {
      x: 0,
      y: 0}
  }
}

module.exports = {
  START_COORD,
  GHOST_HOUSE,
  WIDTH,
  HEIGHT,
  PLAYER_START,
  startGid,
  endGid,
  FoodTiles
}
