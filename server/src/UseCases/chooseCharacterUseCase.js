import { Error } from "../Core/utils.js";

import Game from "../Entities/Game.js";
import { Characters } from "../Entities/Character.js";

/**
 * @param {string} playerId
 * @param {Object} data
 * @param {String} data.characterName
 * @param {Game} game
 */
export default function chooseCharacterUseCase(playerId, data, game) {
    if (!data.characterName) {
        return Error.badRequest("No character name provided");
    }

    const player = game.findPlayerById(playerId);

    if (!player) {
        return Error.badRequest("You are not in a game");
    }

    const character = Characters.findByName(data.characterName);

    if (!character) {
        return Error.badRequest("Character not found");
    }

    if (game.findPlayerByCharacter(character.name)) {
        return Error.forbidden("Character already in use");
    }

    try {
        player.character = character;
    } catch (error) {
        return Error.badRequest(error);
    }
}
