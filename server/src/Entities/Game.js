import Round from "./Round.js";
import Player from "./Player.js";

import { isFilledArray, isObject } from "../Core/utils.js";

import { ZECA } from "./Character.js";

class Game {
    hostId = "";
    /** @type {Player[]}*/ players = [];
    didGameStart = false;
    maxPlayers = 6;
    minPlayers = 3;
    /** @type {Round[]} */ rounds = [];

    /**
     *
     * @param {Object} data
     * @param {Game} data.game
     */
    constructor(data) {
        if (isObject(data)) {
            const { hostId, players } = data.game;
            this.hostId = hostId;
            this.players = players;
        }
    }

    get summary() {
        return {
            hostId: this.hostId,
            players: this.players.map((player) => {
                const {
                    name,
                    character,
                    baseScore,
                    killerScore,
                    score,
                    playerId,
                } = player;

                return {
                    name,
                    character,
                    baseScore,
                    killerScore,
                    score,
                    playerId,
                };
            }),
            didGameStart: this.didGameStart,
            rounds: this.rounds.map((r) => r.summary),
        };
    }

    get killerIds() {
        return this.rounds.map((round) => round.killerId);
    }

    end() {
        this.hostId = "";
        this.players = [];
        this.didGameStart = false;
        this.maxPlayers = 6;
        this.rounds = [];
    }

    start(killerId = "") {
        if (this.canGameStart()) {
            this.didGameStart = true;
            return this.nextRound(killerId);
        }

        return false;
    }

    get currentRound() {
        return this.rounds[this.rounds.length - 1];
    }

    getRandomInt = (max) => Math.floor(Math.random() * max);

    getRandomPlayerId(killerIds = []) {
        const { players } = this;

        const playersPool = killerIds.length
            ? players.filter((p) => !killerIds.includes(p.playerId))
            : players;

        if (playersPool.length) {
            const playerIndex = this.getRandomInt(playersPool.length - 1);

            return playersPool[playerIndex].playerId;
        }

        return "";
    }

    nextRound = (killerIdParam = "") => {
        const { killerIds, currentRound, rounds } = this;

        if (!currentRound || !currentRound.canStartANewTurn()) {
            const killerId = killerIdParam || this.getRandomPlayerId(killerIds);

            rounds.push(new Round(killerId));
            this.defineZecaFavoritePlace(killerId);
            return true;
        }

        return false;
    };

    defineZecaFavoritePlace(killerId) {
        const { players } = this;

        const zecaPlayer = this.findPlayerByCharacter(ZECA.name);

        if (zecaPlayer) {
            let newAction = "";

            const killerIndex = players.indexOf(this.findPlayerById(killerId));
            const zecaPlayerIndex = players.indexOf(zecaPlayer);

            const isZecaTheKiller = zecaPlayerIndex === killerIndex;

            if (!isZecaTheKiller) {
                newAction = players[killerIndex].character.favoriteAction;
            }

            this.players[zecaPlayerIndex].character.favoriteAction = newAction;
        }
    }

    canGameStart() {
        const { players, minPlayers, didGameStart } = this;
        return (
            !didGameStart &&
            players.length >= minPlayers &&
            players.every((player) => player.character != null)
        );
    }

    /**
     * @param {string} playerName
     */
    findPlayerByName(playerName) {
        return this.players.find((player) => player.name === playerName);
    }

    /**
     * @param {string} characterName
     */
    findPlayerByCharacter(characterName) {
        return this.players.find(
            (p) => p.character && p.character.name === characterName
        );
    }

    /**
     * @param {string} playerId
     */
    findPlayerById(playerId) {
        return this.players.find((player) => player.playerId === playerId);
    }

    /**
     * @param {string} playerName
     * @param {string} playerId
     */
    addPlayer(playerName, playerId) {
        if (
            this.findPlayerByName(playerName) ||
            this.findPlayerById(playerId)
        ) {
            return false;
        }

        if (this.hostId === "") {
            this.hostId = playerId;
        }

        this.players.push(new Player(playerName, playerId));
        return true;
    }

    /**
     * @param {string} playerId
     */
    disconnectPlayer(playerId, shouldReassignHostId = true) {
        const { players, hostId, didGameStart, killerIds, minPlayers, rounds } =
            this;

        if (!playerId || !players.find((p) => p.playerId === playerId)) {
            return false;
        }

        const newPlayers = players.filter((p) => p.playerId !== playerId);

        this.players = newPlayers;

        if (newPlayers.length < minPlayers) {
            if (didGameStart) {
                this.didGameStart = false;
            }

            if (rounds.length) {
                this.rounds = [];
            }

            if (!isFilledArray(newPlayers) && hostId) {
                this.hostId = "";
            }
        }

        if (
            isFilledArray(newPlayers) &&
            shouldReassignHostId &&
            playerId === hostId &&
            !didGameStart
        ) {
            this.hostId = this.getRandomPlayerId(killerIds);
        }

        return true;
    }
}

export default Game;
