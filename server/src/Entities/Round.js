import Turn from "./Turn.js";

export default class Round {
    MAX_TURNS = 3;
    currentTurnIndex = 0;
    /** @type {Turn[]}  */ turnsHistory = [];
    killerId = "";

    /**
     * @param {string} killerId
     * @constructor
     */
    constructor(killerId) {
        this.killerId = killerId;
        this.nextTurn();
    }

    canStartANewTurn = () => {
        return this.currentTurnIndex < this.MAX_TURNS;
    };

    get turns() {
        return this.turnsHistory.map((turn) => turn.chosenActions);
    }

    get currentTurn() {
        return this.turnsHistory[this.turnsHistory.length - 1];
    }

    get summary() {
        return {
            killerId: this.killerId,
            turns: this.turns,
        };
    }

    nextTurn = () => {
        const { currentTurnIndex, turnsHistory, killerId } = this;

        if (this.canStartANewTurn()) {
            turnsHistory.push(new Turn(killerId, currentTurnIndex + 1));
            this.currentTurnIndex += 1;
            return true;
        }

        return false;
    };
}
