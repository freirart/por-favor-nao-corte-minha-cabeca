/**
 * @typedef {import("socket.io").Socket"} Socket
 */

/**
 * @param {Socket} socket
 * @param {Object} data
 * @param {String} customMsg
 */
export default function gameStatusUpdate(
    socket,
    data,
    customMsg = "game-status-update"
) {
    socket.broadcast.emit(customMsg, data);
}
