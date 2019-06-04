import MainGame from "./scenes/MainGame"
import {Client} from "colyseus.js"

class ClientGame extends MainGame {
  constructor() {
    super({key: 'maingame'})
    console.log("Main game")
  }

  create() {
    super.create()
    this.createRoom()
  }

  createRoom() {
    const client = new Client('ws://127.0.0.1:8000')

    console.log("Joining rooms")
    const room = client.join('room')
    console.log("Joined room", room)
    this.room = room

    room.listen('players/:id', ({path: {id}, operation, value}) => {
      if (operation === "add") {
        console.log("client joins room")
      }
    })
    room.listen('enemies/:id/:attribute', ({path, operation, value}) => {
      console.log("What is received for enemy", operation, path.id, path.attribute, value)
    })
  }
}

export default ClientGame
