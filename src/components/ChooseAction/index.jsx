import React from "react";

import { Text, Stack, Box, Image, Tooltip } from "@chakra-ui/react";

import Spin from "../Icons/Spin";

import IMAGES from "../../imgs/Images";

import { Characters } from "../../../server/src/Entities/Character";

import {
  isFilledArray,
  isObjectWithProps,
  mappedActions,
} from "../../../server/src/Core/utils";

import "../ChooseCharacter/index.css";

class ChooseAction extends React.Component {
  state = {
    selectedActions: [],
    maximizedSelections: false,
  };

  eventName = "choose-action";

  componentDidUpdate(prevProps, prevState) {
    const { state, props, eventName } = this;
    const { socket, game, refreshFn } = props;
    const { maximizedSelections, selectedActions } = state;

    const isPlayerTheKiller = this.isPlayerTheKiller();

    const maxSelectedActions = isPlayerTheKiller
      ? game.currentRound.currentTurn.killerMaxActions
      : game && game.currentRound
      ? game.currentRound.currentTurnIndex
      : 1;

    const newState = {};

    if (
      prevState.selectedActions.length < selectedActions.length &&
      !maximizedSelections &&
      socket &&
      selectedActions.length >= maxSelectedActions
    ) {
      if (!isFilledArray(socket.listeners(eventName))) {
        socket.on(eventName, (data) => {
          if (data.success) {
            mappedActions["update-turn"](game, data);

            refreshFn();
          } else {
            console.error("> Erro ao escolher ação:", data);
          }
        });
      }

      newState.maximizedSelections = true;
      socket.emit(eventName, selectedActions);
    }

    if (
      maximizedSelections &&
      game &&
      game.currentRound &&
      game.currentRound.currentTurn &&
      !isFilledArray(Object.keys(game.currentRound.currentTurn.chosenActions))
    ) {
      if (isPlayerTheKiller) {
        newState.selectedActions = [];
      }

      newState.maximizedSelections = false;
    }

    if (isObjectWithProps(newState)) {
      this.setState({ ...newState });
    }
  }

  choose = (action) => {
    const { selectedActions } = this.state;

    if (action && !selectedActions.includes(action)) {
      this.setState({ selectedActions: [...selectedActions, action] });
    }
  };

  isPlayerTheKiller = () => {
    const { game, playerId } = this.props;

    return (
      game &&
      game.currentRound &&
      game.currentRound.currentTurn.killerId === playerId
    );
  };

  render() {
    const { didGameStart, game, playerId } = this.props;
    const { selectedActions, maximizedSelections } = this.state;

    const isPlayerTheKiller = this.isPlayerTheKiller();

    const cards = game
      ? Characters.getAvailableActions()
          .filter((card, index, arr) => arr.indexOf(card) === index)
          .map((action) => {
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

    if (!(game && game.currentRound && didGameStart)) {
      return null;
    } else if (maximizedSelections) {
      return (
        <Text>
          <Spin /> Aguardando jogadores...
        </Text>
      );
    }

    const prefix = isPlayerTheKiller
      ? "Quais lugares deseja visitar"
      : "Para onde deseja fugir";

    const currentTurn = game.currentRound.currentTurnIndex;
    const allTurns = game.players.length;

    return (
      <div>
        <Text>{prefix + ` esta noite? (${currentTurn}/${allTurns})`}</Text>
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
                    onClick={() => (disabled ? {} : this.choose(action))}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Stack>
      </div>
    );
  }
}

export default ChooseAction;
