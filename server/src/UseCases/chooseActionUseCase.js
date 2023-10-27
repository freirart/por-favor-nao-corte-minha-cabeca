import { Error, Success, isFilledArray } from "../Core/utils.js";

import Game from "../Entities/Game.js";
import { Characters } from "../Entities/Character.js";

/**
 * @param {string} playerId
 * @param {string[]} actions
 * @param {Game} game
 * @returns {Promise<Success|Error>}
 */
export default function chooseActionUseCase(playerId, actions, game) {
    if (!isFilledArray(actions)) {
        return Error.badRequest("Actions should be an array with locations.");
    }

    const { characters } = Characters;

    if (!actions.every((a) => characters.find((c) => c.favoriteAction === a))) {
        return Error.badRequest("Actions array contain invalid actions.");
    }

    return game.currentRound.currentTurn.chooseAction(playerId, actions);
}
