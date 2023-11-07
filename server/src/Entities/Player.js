import { BaseCharacter } from "./Character.js";
import Point from "./Point.js";

export default class Player {
  /** @type {BaseCharacter} */ character = null;
  /** @type {Point[]} */ killerScore = [];
  /** @type {Point[]} */ baseScore = [];

  /**
   * @param {string} name
   * @param {string} playerId
   * @returns {Player}
   * @constructor
   */
  constructor(name, playerId) {
    this.name = name;
    this.playerId = playerId;
  }
}
