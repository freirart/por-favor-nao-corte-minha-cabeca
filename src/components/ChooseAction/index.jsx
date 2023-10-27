import React, { useState, useEffect } from "react";

import { Text, Stack, Box, Image, Tooltip } from "@chakra-ui/react";

import IMAGES from "../../imgs/Images";

import { Characters } from "../../../server/src/Entities/Character";

import "../ChooseCharacter/index.css";

const ChooseAction = ({ didGameStart, socket, game, playerId }) => {
  const [selectedActions, setSelectedActions] = useState([]);
  const [maximizedSelections, setMaximizedSelections] = useState(false);

  const availableActions = Characters.getAvailableActions();

  const cards = game
    ? availableActions.map((action) => {
        const cardKey = `${action}Card`;

        let isFavoriteAction = false;

        const player = game.findPlayerById(playerId);

        if (player && player.character) {
          const favoriteAction = player.character.favoriteAction;
          isFavoriteAction = favoriteAction === action;
        }

        return { src: IMAGES[cardKey], action, isFavoriteAction };
      })
    : [];

  const isPlayerTheKiller =
    game &&
    game.currentRound &&
    game.currentRound.currentTurn.killerId === playerId;

  const maxSelectedActions = isPlayerTheKiller
    ? game.currentRound.currentTurn.killerMaxActions
    : 1;

  const choose = (action) => {
    if (action && !selectedActions.includes(action)) {
      setSelectedActions([...selectedActions, action]);
    }
  };

  useEffect(() => {
    if (
      !maximizedSelections &&
      socket &&
      selectedActions.length >= maxSelectedActions
    ) {
      setMaximizedSelections(true);
      socket.emit("choose-action", selectedActions);
    }
  }, [selectedActions, maxSelectedActions]);

  if (!didGameStart) {
    return null;
  }

  return (
    <div>
      <Text>
        {!isPlayerTheKiller
          ? "Para onde deseja fugir esta noite?"
          : "Quais lugares deseja visitar esta noite?"}
      </Text>
      <Stack width="951px" wrap="wrap" direction="row">
        {cards.map(({ src, action, isFavoriteAction }, index) => {
          let className = "cardBox";

          if (isFavoriteAction && !isPlayerTheKiller) {
            className += " favoriteAction";
          }

          const disabled =
            maximizedSelections || selectedActions.includes(action);

          if (disabled) {
            className += " disabled";
          }

          return (
            <Tooltip
              key={index}
              isDisabled={!isFavoriteAction || disabled || isPlayerTheKiller}
              label="Este é o seu lugar favorito!"
            >
              <Box className={className}>
                <Image
                  src={src}
                  className="card"
                  onClick={() => (disabled ? {} : choose(action))}
                />
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </div>
  );
};

export default ChooseAction;
