import React, { useState } from "react";

import { Text, Box, Image, Stack, Tooltip } from "@chakra-ui/react";

import { Characters } from "../../../server/src/Entities/Character";

import IMAGES from "../../imgs/Images";

import { isFilledArray, mappedActions } from "../../../server/src/Core/utils";

import "./index.css";

const ChooseCharacter = ({
  socket,
  externalizeCharacterName,
  didPlayerEnteredTheGame,
  game,
  playerId,
  refreshFn,
}) => {
  const eventName = "choose-character";

  const [didUserSelectItsChar, setDidUserSelectItsChar] = useState(false);

  const select = (characterName) => {
    if (socket) {
      if (!isFilledArray(socket.listeners(eventName))) {
        socket.on(eventName, (data) => {
          if (data.success) {
            mappedActions["update-players"](game, {
              playerId,
              characterName,
            });

            console.log("> Escolhi o meu personagem!", game.summary);

            refreshFn();
          } else {
            console.error("> Erro ao escolher o personagem:", data);
          }
        });
      }

      socket.emit(eventName, { characterName });

      externalizeCharacterName(characterName);
      localStorage.setItem(eventName, characterName);
      setDidUserSelectItsChar(true);
    }
  };

  const cards = Characters.characters.map((c) => {
    const srcKey = `${c.normalizedName}Card`;
    const disabled = game && Boolean(game.findPlayerByCharacter(c.name));
    return {
      characterName: c.name,
      src: IMAGES[srcKey],
      disabled,
    };
  });

  if (!didPlayerEnteredTheGame || didUserSelectItsChar) {
    return null;
  }

  return (
    <div>
      <Text>Escolha o seu personagem: </Text>
      <Stack width="951px" wrap="wrap" direction="row">
        {cards.map(({ src, characterName: charName, disabled }, index) => {
          let className = "cardBox";

          if (disabled) {
            className += " disabled";
          }

          const active = localStorage.getItem(eventName) === charName;

          if (active) {
            className += " active";
          }

          return (
            <Tooltip
              key={index}
              label="Este foi o seu último personagem escolhido!"
              isDisabled={!active || disabled}
            >
              <Box className={className}>
                <Image
                  src={src}
                  className="card"
                  onClick={() => (disabled ? {} : select(charName))}
                />
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </div>
  );
};

export default ChooseCharacter;
