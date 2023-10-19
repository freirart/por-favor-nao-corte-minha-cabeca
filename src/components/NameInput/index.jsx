import React, { useEffect, useState } from "react";

const NameInput = ({
    socket,
    didPlayerEnteredTheGame,
    externalizePlayerName,
}) => {
    const keyName = "playerName";

    const [playerName, setPlayerName] = useState(localStorage.getItem(keyName));

    useEffect(() => {
        const timer = setTimeout(() => {
            externalizePlayerName(playerName);
            localStorage.setItem(keyName, playerName);
        }, 500);

        return () => clearTimeout(timer);
    }, [playerName]);

    const enterGame = () => {
        socket.emit("new-connection", { name: playerName });
    };

    if (didPlayerEnteredTheGame) {
        return null;
    }

    return (
        <div>
            <p>
                <label htmlFor={keyName}>Como deseja ser chamado(a)?</label>
                <input
                    id={keyName}
                    value={playerName}
                    type="text"
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <button disabled={!playerName} onClick={enterGame}>
                    Enter Game
                </button>
            </p>
        </div>
    );
};

export default NameInput;
