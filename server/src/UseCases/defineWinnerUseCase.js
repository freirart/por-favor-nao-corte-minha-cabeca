import { isFilledArray } from "../Core/utils.js";

import Game from "../Entities/Game.js";
import Player from "../Entities/Player.js";

/**
 *
 * @param {Player} player
 * @returns
 */
const compareScore = (player, winner) => {
  return (
    player.baseScore.length + player.killerScore.length >=
    winner.baseScore.length + winner.killerScore.length
  );
};

/**
 *
 * @param {Game} game
 */
const defineWinnerUseCase = (game) => {
  const { players } = game;

  let [winner] = players;

  for (const p of players) {
    if (compareScore(p, winner)) {
      winner = p;
    }
  }

  const draw = players.filter(
    (p) => p.playerId !== winner.playerId && compareScore(p, winner)
  );

  if (isFilledArray(draw)) {
    for (const d of draw) {
      if (d.killerScore.length > winner.killerScore.length) {
        winner = d;
      }
    }
  }

  game.winnerId = winner.playerId;
};

export default defineWinnerUseCase;
