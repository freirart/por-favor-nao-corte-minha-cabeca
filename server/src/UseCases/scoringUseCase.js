import Game from "../Entities/Game.js";
import Point from "../Entities/Point.js";

/**
 * @param {Game} game
 */
const scoringUseCase = (game) => {
    const { currentRound, players, rounds } = game;
    const { currentTurn, killerId, currentTurnIndex } = currentRound;
    const { chosenActions } = currentTurn;

    const killer = players.find((p) => p.playerId === killerId);
    const killerActions = chosenActions[killerId];

    for (const [playerId, [action]] of Object.entries(chosenActions)) {
        if (playerId !== killerId) {
            const player = players.find((p) => p.playerId === playerId);
            const roundIndex = rounds.indexOf(currentRound);
            const turnIndex = currentTurnIndex;

            const favoriteAction = player.character.favoriteAction === action;

            if (!killerActions.includes(action)) {
                player.baseScore.push(
                    new Point("Survived", roundIndex, turnIndex)
                );

                if (favoriteAction) {
                    player.baseScore.push(
                        new Point(
                            "Survived at favorite place",
                            roundIndex,
                            turnIndex
                        )
                    );
                }
            } else {
                killer.killerScore.push(
                    new Point("Killed", roundIndex, turnIndex)
                );

                if (favoriteAction) {
                    killer.killerScore.push(
                        new Point(
                            "Killed at favorite place",
                            roundIndex,
                            turnIndex
                        )
                    );
                }
            }
        }
    }
};

export default scoringUseCase;
