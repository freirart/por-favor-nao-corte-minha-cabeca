import { Error } from "../Core/utils.js";

import logger from "../Entities/Logger.js";

import startGameUseCase from "../UseCases/startGameUseCase.js";

import gameStatusUpdate from "./game-status-update.js";

/**
 * @typedef {import("../Entities/Game.js")} Game
 * @typedef {import("socket.io").Socket} Socket
 */

/**
 * @param {Socket} socket
 * @param {Game} game
 */
export default function startGame(socket, game) {
    const hostId = socket.id;

    const result = startGameUseCase(hostId, game);

    const emitData = { success: true };

    if (result instanceof Error) {
        logger.error(result);
        emitData.success = false;
        emitData.error = result.message;
    } else {
        emitData.didGameStart = result;
        emitData.killerId = game.currentRound.killerId;
        gameStatusUpdate(socket, emitData, "start-game");
    }

    socket.emit("start-game", emitData);
}
