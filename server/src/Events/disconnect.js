import gameStatusUpdate from "./game-status-update.js";

/**
 * @typedef {import("../Entities/Game.js")} Game
 * @typedef {import("socket.io").Socket"} Socket
 */

/**
 * @param {Socket} socket
 * @param {Game} game
 */
export default function disconnect(socket, game) {
    const playerId = socket.id;

    if (game.findPlayerById(playerId)) {
        game.disconnectPlayer(playerId);

        gameStatusUpdate(socket, {
            action: "update-game",
            data: { ...game.summary },
        });
    }
}
