import React, { useState } from "react";

import { Tooltip, Button, Text } from "@chakra-ui/react";

import Spin from "../Icons/Spin";

import { isFilledArray } from "../../../server/src/Core/utils";

const StartGame = ({
  isHost,
  characterName,
  socket,
  game,
  externalizeDidGameStart,
}) => {
  const [didGameStart, setDidGameStart] = useState(false);

  const canGameStart = game && game.canGameStart();

  const host = game && game.players.find((p) => p.playerId === game.hostId);

  const eventName = "start-game";

  if (game && socket && !isFilledArray(socket.listeners(eventName))) {
    socket.on(eventName, (data) => {
      if (data.success) {
        if (game.start(data.killerId)) {
          console.log("> Started game:", game.summary);
          setDidGameStart(true);
          externalizeDidGameStart(true);
        } else {
          console.error("Failed to start game");
        }
      } else {
        alert(data.error);
      }
    });
  }

  const start = () => {
    if (socket) {
      socket.emit(eventName);
    }
  };

  if (!characterName || didGameStart) {
    return null;
  }

  return (
    <>
      {isHost ? (
        <Tooltip
          hasArrow
          isDisabled={canGameStart}
          placement="top"
          label="Não há jogadores o suficiente!"
        >
          <Button isDisabled={!canGameStart} onClick={start}>
            Start Game
          </Button>
        </Tooltip>
      ) : (
        <Text>
          <Spin />{" "}
          {!canGameStart
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
