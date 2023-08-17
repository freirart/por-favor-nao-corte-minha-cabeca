class Success {
    constructor(status = 200, message) {
        this.status = status;
        this.message = message;
    }

    /**
     * 
     * @param {string} message
     * @returns {Success}
     * @memberof Success
     * @static
     */
    static get status() {
        return this.status;
    }

    /**
     * 
     * @param {string} message
     * @returns {Success}
     * @memberof Success
     * @static
     */
    static message(message = 'Success') {
        return new Success(this.status, message);
    }

    /**
     * 
     * @param {string} message
     * @returns {Success}
     * @memberof Success
     * @static
     */
    static created(message = 'Created') {
        return new Success(201, message);
    }

    /**
     * 
     * @param {string} message
     * @returns {Success}
     * @memberof Success
     * @static
     */
    static accepted(message = 'Accepted') {
        return new Success(202, message);
    }
}

class Error {
    constructor(status = 500, message) {
        this.status = status;
        this.message = message;
    }

    /**
     * 
     * @param {string} message
     * @returns {Error}
     * @memberof Error
     * @static
     */
    static message(message = 'Error') {
        return new Error(this.status, message);
    }

    /**
     * 
     * @param {string} message
     * @returns {Error}
     * @memberof Error
     * @static
     * @example
     */
    static badRequest(message = 'Bad Request') {
        return new Error(400, message);
    }

    /**
     * 
     * @param {string} message
     * @returns {Error}
     * @memberof Error
     * @static
     */
    static unauthorized(message = 'Unauthorized') {
        return new Error(401, message);
    }

    /**
     * 
     * @param {string} message
     * @returns {Error}
     * @memberof Error
     * @static
     */
    static forbidden(message = 'Forbidden') {
        return new Error(403, message);
    }

    /**
     * 
     * @param {string} message
     * @returns {Error}
     * @memberof Error
     * @static
     */
    static notFound(message = 'Not Found') {
        return new Error(404, message);
    }
}

export { Success, Error };