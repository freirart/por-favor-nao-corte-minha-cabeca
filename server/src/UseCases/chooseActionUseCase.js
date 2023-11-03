import { Error, isFilledArray } from "../Core/utils.js";

import { Characters } from "../Entities/Character.js";

/**
 * @typedef {import("../Entities/Game.js")} Game
 * @typedef {import("../Core/utils.js").Success} Success
 */

/**
 * @param {string} playerId
 * @param {string[]} actions
 * @param {Game} game
 */
const chooseActionUseCase = (playerId, actions, game) => {
    if (!isFilledArray(actions)) {
        return Error.badRequest("Actions should be an array with locations.");
    }

    const { characters } = Characters;

    if (
        !actions.every(
            (a) => !a || characters.find((c) => c.favoriteAction === a)
        )
    ) {
        return Error.badRequest("Actions array contain invalid actions.");
    }

    try {
        const { currentRound, players, nextRound } = game;
        const { currentTurn, nextTurn } = currentRound;
        const { chosenActions, chooseAction } = currentTurn;

        chooseAction(playerId, actions);

        const didTurnEnd = Object.keys(chosenActions).length === players.length;

        if (didTurnEnd) {
            if (currentRound.canStartANewTurn()) {
                nextTurn();
            } else {
                nextRound();
            }
        }
    } catch (err) {
        console.error(err);
        return Error.message(err);
    }
};

export default chooseActionUseCase;
