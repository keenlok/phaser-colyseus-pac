// This file contains the data that is tied to the map, like the locations
// that the charcter will spawn at, the tiles that are for the ghost house,
// the food tiles etc.

// This file is required for map.json to "work" properly with the game
const constants = require('../config/constants')
const directions = constants.directions
const TileSize = constants.TileSize

const mapWidth = 28
const mapHeight = 29

const WIDTH = TileSize * mapWidth
const HEIGHT = TileSize * mapHeight

const PLAYER_START = [{x: 23, y: 24}, {x: 4, y: 5}]

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

const specialFood = [
  {x: 1, y: 9},
  {x: 26, y: 9},
  {x: 1, y: 19},
  {x: 26, y: 19}
]

const numFood = 328 + specialFood.length

const START_COORD = {
  A: {
    x: 5,
    y: 22,
    startDir: directions.UP,
    exit: {
      x: 0,
      y: 0
    }
  },
  B: {
    x: 6,
    y: 25,
    startDir: directions.RIGHT,
    exit: {
      x: 0,
      y: 0
    }
  },
  C: {
    x: 2,
    y: 24,
    startDir: directions.LEFT,
    exit: {
      x: 9,
      y: 22
    }
  },
  D: {
    x: 4,
    y: 24,
    startDir: directions.UP,
    exit: {
      x: 0,
      y: 0}
  }
}

module.exports = {
  mapHeight,
  mapWidth,
  START_COORD,
  GHOST_HOUSE,
  WIDTH,
  HEIGHT,
  PLAYER_START,
  startGid,
  endGid,
  FoodTiles,
  numFood,
  specialFood
}
