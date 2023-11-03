import { Error } from "../Core/utils.js";

import Game from "../Entities/Game.js";
import logger from "../Entities/Logger.js";

import chooseActionUseCase from "../UseCases/chooseActionUseCase.js";

import gameStatusUpdate from "./game-status-update.js";

/**
 * @param {Socket} socket
 * @param {string[]} actions
 * @param {Game} game
 */
export default function chooseAction(socket, actions, game) {
    const playerId = socket.id;

    const response = chooseActionUseCase(playerId, actions, game);

    const emitData = { success: true };

    if (response instanceof Error) {
        logger.error(response);
        emitData.success = false;
        emitData.error = response.message;
    } else {
        gameStatusUpdate(socket, {
            action: "update-turn",
            data: { playerId, actions: [""] },
        });
    }

    socket.emit("choose-action", emitData);
}
