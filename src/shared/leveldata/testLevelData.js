// This file contains the data that is tied to the map, like the locations
// that the charcter will spawn at, the tiles that are for the ghost house,
// the food tiles etc.

// This file is required for mapFinalTiles.json to "work" properly with the game
const constants = require('../config/constants')
const directions = constants.directions
const TileSize = constants.TileSize

const mapWidth = 25
const mapHeight = 25

const WIDTH = TileSize * mapWidth
const HEIGHT = TileSize * mapHeight

const PLAYER_START = {
  x: 12,
  y: 12
}

let houseTiles = []
let startGid = 141
let endGid = 165
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

const FoodTiles = [166, 167]

const numFood = 260

// const ENEMIES = [
//   'hermit'
// ]

const START_COORD = {
  A: {
    x: 13,
    y: 18,
    startDir: directions.UP,
    exit: {
      x: 0,
      y: 0
    }
  },
  B: {
    x: 14,
    y: 21,
    startDir: directions.RIGHT,
    exit: {
      x: 0,
      y: 0
    }
  },
  C: {
    x: 10,
    y: 20,
    startDir: directions.LEFT,
    exit: {
      x: 9,
      y: 22
    }
  },
  D: {
    x: 12,
    y: 20,
    startDir: directions.UP,
    exit: {
      x: 0,
      y: 0}
  }
}

module.exports = {
  mapWidth,
  mapHeight,
  START_COORD,
  GHOST_HOUSE,
  WIDTH,
  HEIGHT,
  PLAYER_START,
  startGid,
  endGid,
  FoodTiles,
  numFood
}
