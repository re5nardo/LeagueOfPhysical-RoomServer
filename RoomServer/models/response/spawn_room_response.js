'use strict';
const ResponseBase = require('./response_base')

module.exports = class SpawnRoomResponse extends ResponseBase {
    constructor(code, gameRoomId) {
        super(code);
        this.gameRoomId = gameRoomId;
    }
}
