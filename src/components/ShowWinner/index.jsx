import React from "react";

import { Heading } from "@chakra-ui/react";

const ShowWinner = ({ game }) => {
  if (game && game.winnerId) {
    const { winnerId, players } = game;
    const { character, name: playerName } = players.find(
      (p) => p.playerId === winnerId
    );
    const { name: characterName } = character;

    return (
      <Heading as="h2">
        O vencedor é {playerName} ({characterName})!
      </Heading>
    );
  }
};

export default ShowWinner;
