import { isFilledArray } from "../Core/utils.js";
import Game from "../Entities/Game.js";

/**
 *
 * @param {Game} game
 */
const defineWinnerUseCase = (game) => {
  const { players } = game;

  let [winner] = players;

  for (const p of players) {
    if (
      p.baseScore.length + p.killerScore.length >=
      winner.baseScore.length + winner.killerScore.length
    ) {
      winner = p;
    }
  }

  const draw = players.filter(
    (p) =>
      p.playerId !== winner.playerId &&
      p.baseScore.length + p.killerScore.length >=
        winner.baseScore.length + winner.killerScore.length
  );

  if (isFilledArray(draw)) {
    winner = draw[0];

    for (const d of draw) {
      if (d.killerScore.length > winner.killerScore.length) {
        winner = d;
      }
    }
  }

  game.winnerId = winner.playerId;
};

export default defineWinnerUseCase;
