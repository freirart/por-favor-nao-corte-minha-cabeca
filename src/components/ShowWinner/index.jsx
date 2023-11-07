import React from "react";

const ShowWinner = ({ game }) => {
  if (game && game.winnerId) {
    const { winnerId, players } = game;
    const { character, name: playerName } = players.find(
      (p) => p.playerId === winnerId
    );
    const { name: characterName } = character;

    return (
      <h1>
        O vencedor é {playerName} ({characterName})!
      </h1>
    );
  }
};

export default ShowWinner;
