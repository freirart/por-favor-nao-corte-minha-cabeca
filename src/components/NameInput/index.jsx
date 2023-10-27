import React, { useEffect, useState } from "react";

import { Text, Button, Input } from "@chakra-ui/react";

const NameInput = ({ socket, didPlayerEnteredTheGame }) => {
  const keyName = "playerName";

  const [playerName, setPlayerName] = useState(
    localStorage.getItem(keyName) || ""
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(keyName, playerName);
    }, 500);

    return () => clearTimeout(timer);
  }, [playerName]);

  const enterGame = () => {
    if (socket) {
      socket.emit("new-connection", { name: playerName });
    }
  };

  if (didPlayerEnteredTheGame) {
    return null;
  }

  return (
    <div>
      <Text>Como deseja ser chamado(a)?</Text>
      <Input
        width={200}
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Um apelido legal"
      />
      <Button disabled={!playerName} onClick={enterGame}>
        Enter Game
      </Button>
    </div>
  );
};

export default NameInput;
