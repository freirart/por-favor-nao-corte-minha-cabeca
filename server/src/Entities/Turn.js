/**
 * @typedef {string[]} Actions
 */

import { isFilledArray } from "../Core/utils.js";

class Turn {
    killerId = "";
    killerMaxActions = 0;
    /** @type {string, Actions} */ chosenActions = {};

    /**
     * @param {string} killerId
     * @param {int} killerMaxActions
     * @constructor
     */
    constructor(killerId, killerMaxActions) {
        this.killerId = killerId;
        this.killerMaxActions = killerMaxActions;
    }

    /**
     * @param {string} playerId
     * @param {Actions} actions
     */
    chooseAction = (playerId, actions) => {
        const { killerId, chosenActions, killerMaxActions } = this;

        if (
            !(playerId in chosenActions) ||
            (playerId === killerId &&
                chosenActions[playerId].length < killerMaxActions)
        ) {
            this.chosenActions[playerId] = [...actions];
            return true;
        } else if (
            playerId in chosenActions &&
            isFilledArray(actions) &&
            !chosenActions[playerId][0] &&
            actions[0]
        ) {
            this.chosenActions[playerId] = actions;
            return true;
        }

        return false;
    };
}

export default Turn;
