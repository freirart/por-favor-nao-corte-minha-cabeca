import React from "react";

import { Tooltip, Button, Text } from "@chakra-ui/react";

import Spin from "../Icons/Spin";

const StartGame = ({ isHost, characterName, socket, game, didGameStart }) => {
  if (!characterName) {
    return null;
  }

  const disabled = !game.canGameStart();

  const host = game.players.find((p) => p.playerId === game.hostId);

  return (
    <>
      {didGameStart ? null : isHost ? (
        <Tooltip
          hasArrow
          isDisabled={!disabled}
          placement="top"
          label="Não há jogadores o suficiente!"
        >
          <Button
            isDisabled={disabled}
            onClick={() => socket.emit("start-game")}
          >
            Start Game
          </Button>
        </Tooltip>
      ) : (
        <Text>
          <Spin />{" "}
          {disabled
            ? "Aguardando jogadores..."
            : `Aguardando o host${
                host ? ` (${host.name})` : ""
              } iniciar a partida...`}
        </Text>
      )}
    </>
  );
};

export default StartGame;
