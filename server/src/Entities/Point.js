class Point {
    reason = "";

    constructor(reason, roundIndex, turnIndex, action) {
        this.reason = reason;
        this.roundIndex = roundIndex;
        this.turnIndex = turnIndex;
        this.action = action;
    }
}

export default Point;
