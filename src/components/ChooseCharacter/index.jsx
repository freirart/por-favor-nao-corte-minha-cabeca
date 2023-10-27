import React, { useState, useEffect } from "react";

import { Text, Box, Image, Stack } from "@chakra-ui/react";

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
  const [selectedCharName, setSelectedCharName] = useState("");

  const cards = Characters.characters.map((c) => {
    const srcKey = `${c.normalizedName}Card`;
    const disabled = game && Boolean(game.findPlayerByCharacter(c.name));
    return {
      characterName: c.name,
      src: IMAGES[srcKey],
      disabled,
    };
  });

  const eventName = "choose-character";

  useEffect(() => {
    if (selectedCharName && socket) {
      if (!isFilledArray(socket.listeners(eventName))) {
        socket.on(eventName, (data) => {
          if (data.success) {
            mappedActions["update-players"](game, {
              playerId,
              characterName: selectedCharName,
            });

            console.log("> Escolhi o meu personagem!", game.summary);

            refreshFn();
          } else {
            console.error("> Erro ao escolher o personagem:", data);
          }
        });
      }

      socket.emit(eventName, { characterName: selectedCharName });

      externalizeCharacterName(selectedCharName);
    }
  }, [selectedCharName]);

  if (!didPlayerEnteredTheGame || selectedCharName) {
    return null;
  }

  return (
    <div>
      <Text>Escolha o seu personagem: </Text>
      <Stack width="951px" wrap="wrap" direction="row">
        {cards.map(({ src, characterName, disabled }, index) => (
          <Box className={`cardBox ${disabled ? "disabled" : ""}`} key={index}>
            <Image
              src={src}
              className="card"
              onClick={() =>
                disabled ? {} : setSelectedCharName(characterName)
              }
            />
          </Box>
        ))}
      </Stack>
    </div>
  );
};

export default ChooseCharacter;
