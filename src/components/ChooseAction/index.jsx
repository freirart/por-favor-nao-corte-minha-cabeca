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
    maxSelectedActions: 1,
  };

  eventName = "choose-action";

  componentDidUpdate(_, prevState) {
    const { getMaxSelectedActions, isPlayerTheKiller, setNewState } = this;

    const newState = {};

    const maxSelectedActions = getMaxSelectedActions();

    if (maxSelectedActions !== prevState.maxSelectedActions) {
      newState.maxSelectedActions = maxSelectedActions;

      if (
        isPlayerTheKiller() ||
        maxSelectedActions < prevState.maxSelectedActions
      ) {
        newState.selectedActions = [];
      }
    }

    setNewState(newState);
  }

  choose = (action) => {
    const {
      eventName,
      props,
      state,
      didUserMaximizeSelection,
      isPlayerTheKiller,
      setNewState,
      updateGame,
    } = this;
    const { socket } = props;
    const { selectedActions } = state;

    const newState = {};

    if (action && !selectedActions.includes(action)) {
      newState.selectedActions = [...selectedActions, action];
    }

    const actions = newState.selectedActions;

    const maximized = didUserMaximizeSelection(actions);

    if (maximized && socket) {
      const socketActions = isPlayerTheKiller()
        ? actions
        : [[...actions].pop()];

      if (isFilledArray(socket.listeners(eventName))) {
        socket.off(eventName);
        updateGame(socketActions);
      } else {
        updateGame(socketActions);
      }

      socket.emit(eventName, socketActions);
    }

    setNewState(newState);
  };

  updateGame = (socketActions) => {
    const { props, eventName } = this;
    const { socket, refreshFn, playerId, game } = props;

    socket.on(eventName, (data) => {
      if (data.success) {
        mappedActions["update-turn"](game, {
          playerId,
          actions: socketActions,
        });

        refreshFn();
      } else {
        console.error("> Erro ao escolher ação:", data);
      }
    });
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
    const { selectedActions } = this.state;
    return this.didUserMaximizeSelection() || selectedActions.includes(action);
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

  getMaxSelectedActions = () => {
    const { game } = this.props;

    const maxSelectedActions = this.isPlayerTheKiller()
      ? game.currentRound.currentTurn.killerMaxActions
      : game && game.currentRound
      ? game.currentRound.currentTurnIndex
      : 1;

    return maxSelectedActions;
  };

  didUserMaximizeSelection = (selectedActionsProps) => {
    const { selectedActions: selectedActionsState, maxSelectedActions } =
      this.state;

    const selectedActions = selectedActionsProps || selectedActionsState;

    return selectedActions.length >= maxSelectedActions;
  };

  setNewState = (newState) => {
    if (isObjectWithProps(newState)) {
      this.setState({ ...newState });
    }
  };

  render() {
    const {
      props,
      getTitle,
      getCards,
      isCardDisabled,
      isTooltipDisabled,
      getCardClassName,
      choose,
    } = this;
    const { didGameStart, game } = props;

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
