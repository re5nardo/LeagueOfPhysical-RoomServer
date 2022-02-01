'use strict';
const express = require('express');
const router = express.Router();
const util = require("util");

const ResponseBase = require('../models/response/response_base');

const roomKeyFormat = `room:%s`;

router.put('/heartbeat/:roomId', function (req, res) {
    try {
        global.redis.expireAsync(util.format(roomKeyFormat, req.params.roomId), 10);
        res.json(new ResponseBase(200));
    } catch (error) {
        console.error(error);
        res.json(new ResponseBase(400));
    }
});

module.exports = router;
