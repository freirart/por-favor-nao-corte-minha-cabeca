import { Server } from "socket.io";
import Events from "./Events.js";
import logger from "./Logger.js";

class Socket {
    /** @type {Server} */ _io;
    constructor() {
        this._io = null;
    }

    init(server) {
        if (this._io) {
            return this._io;
        }

        this._io = new Server(server, {
            /* options */
        });
        this._io.on("connection", (socket) => {
            logger.info(`Socket connected: ${socket.id}`);
            Events.registry(socket, this._io);
        });

        return this._io;
    }

    get io() {
        return this._io;
    }
}

export default new Socket();
