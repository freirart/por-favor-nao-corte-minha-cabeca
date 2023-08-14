import { Server, Socket } from "socket.io";
import Game, { GameStates } from "../Game/index.js"

/**
 * @param {Socket} socket 
 * @param {Server} io
 * @param {Object} data
 * @param {string} data.name
 */
export default function newConnection(socket, io, data) {
    if (io.engine.clientsCount >= 6) {
        socket.emit('new-connection-error', {
            error: 'Game is full'
        })
        return
    }

    if (!data) {
        socket.emit('new-connection-error', {
            error: 'Invalid data'
        })
        return
    }

    if (!data.name) {
        socket.emit('new-connection-error', {
            error: 'Name is required'
        })
        return
    }

    const isHost = io.engine.clientsCount === 1 && !Game.hostSocketId.length

    Game.players.add(data.name, socket.idm, {
        isHost: isHost
    })

    Game.hostSocketId = socket.id

    socket.emit('new-connection-success', {
        gameStatus: Game.gameStatus(),
    })

    if (io.engine.clientsCount >= 3) {
        Game.updateState(GameStates.WAITING_HOST)
        io.emit(Game.currentState, {
            status: Game.currentState(),
        })
        return
    }
}