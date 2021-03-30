'use strict';
const express = require('express');
const router = express.Router();
const util = require("util");

const ResponseBase = require('../models/response/response_base');

const gameRoomKeyFormat = `gameRoom:%s`;

router.put('/alive/:gameRoomId', function (req, res) {
    global.redis.setexAsync(util.format(gameRoomKeyFormat, req.params.gameRoomId), 10, Date.now());
    res.json(new ResponseBase(200));
});

module.exports = router;
