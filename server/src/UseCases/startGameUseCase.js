import { Error } from "../Core/utils.js";

/**
 * @typedef {import("../Entities/Game.js")} Game
 */

/**
 * @param {string} hostId
 * @param {Game} game
 */
export default function startGameUseCase(hostId, game) {
    if (game.hostId !== hostId || !game.findPlayerById(hostId)) {
        return Error.forbidden("You are not the host");
    }

    if (game.players.length < game.minPlayers) {
        return Error.forbidden(`You need at least ${game.minPlayers} players`);
    }

    if (!game.canGameStart()) {
        return Error.forbidden(
            "The conditions to start the game were not met."
        );
    }

    return game.start();
}
