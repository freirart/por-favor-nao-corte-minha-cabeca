import React from "react";

import Spin from "../Icons/Spin";

const StartGame = ({ isHost, characterName, socket }) => {
  if (!characterName) {
    return null;
  }

  return isHost ? (
    <button onClick={() => socket.emit("start-game")}>Start Game</button>
  ) : (
    <p>
      <Spin />
      Aguardando jogadores...
    </p>
  );
};

export default StartGame;
