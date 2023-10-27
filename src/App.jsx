import React from "react";
import { io, connect, Socket } from "socket.io-client";

import { Heading } from "@chakra-ui/react";

import Game from "../server/src/Entities/Game";

import { mappedActions, isObject } from "../server/src/Core/utils";

import NameInput from "./components/NameInput";
import ChooseCharacter from "./components/ChooseCharacter";
import StartGame from "./components/StartGame";
import ChooseAction from "./components/ChooseAction";

class App extends React.Component {
  state = {
    playerId: undefined,
    isHost: undefined,
    didPlayerEnteredTheGame: false,
    characterName: undefined,
    refreshCount: 0,
    didGameStart: false,
  };

  /** @type {Socket} */ socket = undefined;
  /** @type {Game} */ game = undefined;

  componentDidMount() {
    if (!this.socket) {
      const socket = import.meta.env.DEV
        ? connect("http://localhost:3000")
        : io();

      this.socket = socket;

      socket.on("connect", () => this.startSocketEvents(socket));
    }
  }

  startSocketEvents = (socket) => {
    const { connected, id: playerId } = socket;

    console.log("> Conectei!", { connected, playerId });

    this.setState({ playerId });

    socket.on("new-connection", (data) => {
      if (!data.success) {
        alert(data.error);
        return;
      }

      const game = new Game(data);

      this.game = game;

      this.refreshFn();

      socket.on("choose-character", this.chooseCharacterResponse);

      socket.on("game-status-update", this.updateGame);

      socket.on("start-game", this.startGameResponse);
    });
  };

  refreshFn = () => {
    const { game, socket, state } = this;
    const { playerId, didPlayerEnteredTheGame, isHost, refreshCount } = state;

    const newState = { refreshCount: refreshCount + 1 };

    if (!isHost && game.hostId === socket.id) {
      newState.isHost = true;
    }

    if (!didPlayerEnteredTheGame && game.findPlayerById(playerId)) {
      newState.didPlayerEnteredTheGame = true;
    }

    this.setState({ ...newState });
  };

  chooseCharacterResponse = (data) => {
    const { game, state, refreshFn } = this;

    if (data.success) {
      const { playerId, characterName } = state;
      mappedActions["update-players"](game, {
        playerId,
        characterName,
      });

      console.log("> Escolhi o meu personagem!", game.summary);

      refreshFn();
    } else {
      console.error("> Erro ao escolher o personagem:", data);
    }
  };

  updateGame = (data) => {
    const { game } = this;

    const actionStr = "action";

    if (isObject(data) && actionStr in data) {
      const action = data[actionStr];

      if (action in mappedActions) {
        mappedActions[action](game, data.data);
      }
    }

    this.refreshFn();

    console.log("> Ajustei as informações do jogador!", game.summary);
  };

  startGameResponse = (data) => {
    const { game } = this;

    if (data.success) {
      if (game.start(data.killerId)) {
        console.log("> Started game:", game.summary);
        this.setState({ didGameStart: true });
      } else {
        console.error("Failed to start game");
      }
    } else {
      alert(data.error);
    }
  };

  getExternalizeInfoFn =
    (infoName) =>
    (info, cbFn = () => {}) => {
      if (info !== this.state[infoName]) {
        this.setState({ [infoName]: info });
      }

      cbFn();
    };

  render() {
    const { state, socket, game } = this;
    const {
      isHost,
      characterName,
      didPlayerEnteredTheGame,
      didGameStart,
      playerId,
    } = state;

    return (
      <div>
        <Heading as="h1">Por Favor Não Corte Minha Cabeça!</Heading>
        <NameInput
          socket={socket}
          didPlayerEnteredTheGame={didPlayerEnteredTheGame}
        />
        <ChooseCharacter
          socket={socket}
          game={game}
          externalizeCharacterName={this.getExternalizeInfoFn("characterName")}
          didPlayerEnteredTheGame={didPlayerEnteredTheGame}
        />
        <StartGame
          didGameStart={didGameStart}
          socket={socket}
          game={game}
          characterName={characterName}
          isHost={isHost}
        />
        <ChooseAction
          playerId={playerId}
          socket={socket}
          game={game}
          didGameStart={didGameStart}
        />
      </div>
    );
  }
}

export default App;
