import { Socket } from "socket.io";

import Game from "../Entities/Game.js";
import logger from "../Entities/Logger.js";

import newConnection from "./new-connection.js";
import disconnect from "./disconnect.js";
import chooseCharacter from "./choose-character.js";
import startGame from "./start-game.js";
import chooseAction from "./choose-action.js";

/**
 * @param {Socket} socket
 * @param {Game} game
 */
export default function mainEvent(socket, game) {
    socket.on("new-connection", (data) => {
        newConnection(socket, data, game);
        console.log(
            `> "new-connection: ${JSON.stringify(game.summary, null, 2)}`
        );
    });

    socket.on("disconnect", () => {
        disconnect(socket, game);
        console.log(`> "disconnect": ${JSON.stringify(game.summary, null, 2)}`);
    });

    socket.on("choose-character", (data) => {
        chooseCharacter(socket, data, game);
        console.log(
            `> "choose-character: ${JSON.stringify(game.summary, null, 2)}`
        );
    });

    socket.on("start-game", () => {
        startGame(socket, game);
        console.log(`> "start-game: ${JSON.stringify(game.summary, null, 2)}`);
    });

    socket.on("choose-action", (data) => {
        chooseAction(socket, data, game);
        console.log(
            `> "choose-action: ${JSON.stringify(game.summary, null, 2)}`
        );
    });

    socket.on("error", (err) => {
        logger.error(`Socket error: ${err}`);
        console.log(`> "error": ${JSON.stringify(game.summary, null, 2)}`);
    });
}
