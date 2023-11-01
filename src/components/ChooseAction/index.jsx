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

  choose = (action) => {
    const {
      eventName,
      props,
      state,
      isPlayerTheKiller,
      didUserMaximizeSelection,
    } = this;
    const { game, refreshFn, playerId, socket } = props;
    const { selectedActions } = state;

    const newState = {};

    if (didUserMaximizeSelection()) {
      if (isPlayerTheKiller()) {
        newState.selectedActions = [action];
      }
    } else if (action && !selectedActions.includes(action)) {
      newState.selectedActions = [...selectedActions, action];
    }

    const actions = newState.selectedActions || selectedActions;

    const maximized = didUserMaximizeSelection(actions);
    debugger;
    if (maximized && socket) {
      if (!isFilledArray(socket.listeners(eventName))) {
        socket.on(eventName, (data) => {
          if (data.success) {
            mappedActions["update-turn"](game, { playerId, actions });

            refreshFn();
          } else {
            console.error("> Erro ao escolher ação:", data);
          }
        });
      }

      socket.emit(eventName, actions);
    }

    if (isObjectWithProps(newState)) {
      console.log(JSON.stringify({ newState }));
      this.setState({ ...newState });
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

  getCards = () => {
    const { game, playerId } = this.props;

    return game
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
  };

  getTitle = () => {
    const { game } = this.props;

    const prefix = this.isPlayerTheKiller()
      ? "Quais lugares deseja visitar"
      : "Para onde deseja fugir";

    const currentTurn = game.currentRound.currentTurnIndex;
    const allTurns = game.players.length;

    return prefix + ` esta noite? (${currentTurn}/${allTurns})`;
  };

  isTooltipDisabled = (card) => {
    const { isFavoriteAction } = card;
    return (
      !isFavoriteAction || this.isCardDisabled(card) || this.isPlayerTheKiller()
    );
  };

  isCardDisabled = (card) => {
    const { action } = card;
    const { maximizedSelections, selectedActions } = this.state;
    return maximizedSelections || selectedActions.includes(action);
  };

  getCardClassName = (card) => {
    const { isFavoriteAction } = card;

    let className = "cardBox";

    if (isFavoriteAction && !this.isPlayerTheKiller()) {
      className += " favoriteAction";
    }

    if (this.isCardDisabled(card)) {
      className += " disabled";
    }

    return className;
  };

  didUserMaximizeSelection = (selectedActionsProps) => {
    const { game } = this.props;
    const { selectedActions: selectedActionsState } = this.state;

    const selectedActions = selectedActionsProps || selectedActionsState;

    const isTheKiller = this.isPlayerTheKiller();

    const maxSelectedActions = isTheKiller
      ? game.currentRound.currentTurn.killerMaxActions
      : game && game.currentRound
      ? game.currentRound.currentTurnIndex
      : 1;

    return selectedActions.length >= maxSelectedActions;
  };

  render() {
    const {
      state,
      props,
      getTitle,
      getCards,
      isCardDisabled,
      isTooltipDisabled,
      getCardClassName,
      choose,
    } = this;
    const { didGameStart, game } = props;

    // console.log({ selectedActions, maximizedSelections });

    if (!(game && game.currentRound && didGameStart)) {
      return null;
    } else if (this.didUserMaximizeSelection()) {
      return (
        <Text>
          <Spin /> Aguardando jogadores...
        </Text>
      );
    }

    return (
      <div>
        <Text>{getTitle()}</Text>
        <Stack width="951px" wrap="wrap" direction="row">
          {getCards().map((card, index) => {
            const { src, action } = card;

            const disabled = isCardDisabled(card);

            return (
              <Tooltip
                key={index}
                isDisabled={isTooltipDisabled(card)}
                label="Este é o seu lugar favorito!"
              >
                <Box className={getCardClassName(card)}>
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
  }
}

export default ChooseAction;
