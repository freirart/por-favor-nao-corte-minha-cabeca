import React, { useState, useEffect } from "react";

import { Characters } from "../../../server/src/Entities/Character";

import IMAGES from "../../imgs/Images";

import "./index.css";

const ChooseCharacter = ({
  socket,
  externalizeCharacterName,
  didPlayerEnteredTheGame,
  game,
}) => {
  const cards = Characters.characters.map((c) => {
    const srcKey = `${c.normalizedName}Card`;
    const alreadyInUse = game && Boolean(game.findPlayerByCharacter(c.name));
    return {
      characterName: c.name,
      src: IMAGES[srcKey],
      alreadyInUse,
    };
  });

  const [selectedCharName, setSelectedCharName] = useState("");

  useEffect(() => {
    if (selectedCharName && socket) {
      externalizeCharacterName(selectedCharName, () => {
        socket.emit("choose-character", {
          characterName: selectedCharName,
        });
      });
    }
  }, [selectedCharName]);

  if (!didPlayerEnteredTheGame || selectedCharName) {
    return null;
  }

  return (
    <div>
      <p>Escolha o seu personagem: </p>
      <div className="charsWrapper">
        {cards.map(({ src, characterName, alreadyInUse }, index) => (
          <img
            className={`card ${alreadyInUse ? "alreadyInUse" : ""}`}
            key={index}
            src={src}
            onClick={() =>
              alreadyInUse ? {} : setSelectedCharName(characterName)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseCharacter;
