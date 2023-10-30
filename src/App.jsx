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

      socket.on("game-status-update", this.updateGame);
    });
  };

  refreshFn = () => {
    const { game, socket, state } = this;
    const { isHost, refreshCount } = state;

    const newState = { refreshCount: refreshCount + 1 };

    if (!isHost && game.hostId === socket.id) {
      newState.isHost = true;
    }

    this.setState({ ...newState });
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

  getExternalizeInfoFn =
    (infoName) =>
    (info, cbFn = () => {}) => {
      if (info !== this.state[infoName]) {
        this.setState({ [infoName]: info });
      }

      cbFn();
    };

  render() {
    const { state, socket, game, refreshFn, getExternalizeInfoFn } = this;
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
          externalizeDidPlayerEnteredTheGame={getExternalizeInfoFn(
            "didPlayerEnteredTheGame"
          )}
        />
        <ChooseCharacter
          socket={socket}
          game={game}
          playerId={playerId}
          refreshFn={refreshFn}
          externalizeCharacterName={getExternalizeInfoFn("characterName")}
          didPlayerEnteredTheGame={didPlayerEnteredTheGame}
        />
        <StartGame
          socket={socket}
          game={game}
          characterName={characterName}
          isHost={isHost}
          externalizeDidGameStart={getExternalizeInfoFn("didGameStart")}
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
