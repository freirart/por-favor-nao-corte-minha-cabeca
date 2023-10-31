import { Error, Success, isFilledArray } from "../Core/utils.js";

import Game from "../Entities/Game.js";
import { Characters } from "../Entities/Character.js";

/**
 * @param {string} playerId
 * @param {string[]} actions
 * @param {Game} game
 * @returns {Promise<Success|Error>}
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
        const { currentRound, players } = game;
        const { chosenActions, killerMaxActions } = currentRound.currentTurn;

        console.log(
            "> Vou atualizar o turno:",
            JSON.stringify(game.currentRound.currentTurn)
        );
        game.currentRound.currentTurn.chooseAction(playerId, actions);
        console.log(
            "> Turno atualizado:",
            JSON.stringify(game.currentRound.currentTurn)
        );

        const didTurnEnd =
            Object.keys(chosenActions).length === players.length &&
            Object.values(chosenActions).find(
                (v) => isFilledArray(v) && v.length === killerMaxActions
            );

        if (didTurnEnd) {
            if (currentRound.canStartANewTurn()) {
                game.currentRound.nextTurn();
            } else {
                game.nextRound();
            }
        }
    } catch (err) {
        console.error(err);
        return Error.message(err);
    }
};

export default chooseActionUseCase;
