import Characters from "./Character.js"
import { Player } from "./Player.js"

/**
 * @readonly
 * @enum {string}
*/
export const GameStates = {
    WAITING_PLAYERS: 'waiting_for_players',
    WAITING_HOST: 'waiting_for_host',
    STARTED: 'started',
    FINISHED: 'finished',
    PAUSED: 'paused'
}

class Game {
    /** @type {string} */ _hostSocketId
    /** @type {Player[]} */ _players
    /** @type {GameStates} */ _currentState

    constructor() {
        this._hostSocketId = ""
        this._players = []
        this._currentState = GameStates.WAITING_PLAYERS
    }

    get game() {
        return {
            host: this._hostSocketId,
            players: this._players,
            state: this._currentState
        }
    }

    get players() {
        return this._players
    }
    
    get hostSocketId() {
        return this._hostSocketId
    }

    /**
     * @param {string} socketId
     */
    set hostSocketId(socketId) {
        this._hostSocketId = socketId
    }

    /**
     * @param {GameStates} state 
     */
    updateState(state) {
        this._currentState = state
    }

    currentState() {
        return this._currentState
    }

    async close() {
        await new Promise(async (resolve, reject) => {
            try {
                await Characters.reset
                this._players = []
                this._hostSocketId = ""
                this._currentState = GameStates.WAITING_PLAYERS
                resolve()
            } catch (err) {
                reject(err)
            }
        })
    }

    start(hostSocketId) {
        if (!hostSocketId) {
            return 'Host socketId is required'
        }

        if (hostSocketId !== this._hostSocketId) {
            return 'You are not the host'
        }

        if (this._currentState === GameStates.STARTED) {
            return this._currentState
        }

        if (this._players._players.length < 3) {
            return 'You need at least 3 players'
        }

        this._currentState = GameStates.STARTED
    }

    get size() {
        return this._players.length
    }

    findPlayerByName(name) {
        return this._players.find(player => player.name === name)
    }

    findPlayerBySocket(socketID) {
        return this._players.find(player => player.socketID === socketID)
    }

    async addPlayer(name, socketID, options = {}) {
        if (this.findPlayerByName(name) || this.findPlayerBySocket(socketID)) {
            return "player already exists"
        }
        const addPromise = new Promise((resolve, _) => {
            this._players.push(new Player(name, socketID, options))
            resolve("success")
        })

        return addPromise.then((data) => data).catch((error) => error)
    }

    /**
     * @param {Player} playerToDisconnect
     */
    disconectPlayer(playerToDisconnect) {
        if (!playerToDisconnect) {
            return
        }

        this._players = this._players.filter(player => player.socketID !== playerToDisconnect.socketID)
    }
}

export default new Game()