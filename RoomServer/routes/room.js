'use strict';
const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const util = require("util");

const SpawnRoomResponse = require('../models/response/spawn_room_response');

const gameRoomKeyFormat = `gameRoom:%s`;

const binPath = 'C:\\Users\\USER\\Desktop\\lop-server-window\\LeagueOfPhysical_Server.exe';

router.post('/spawnRoom', function (req, res) {
    spawnRoom(req.body.region, req.body.gameRoomId, req.body.expectedPlayerList);
    res.json(JSON.stringify(new SpawnRoomResponse(200, req.body.gameRoomId)));
});

function spawnRoom(region, gameRoomId, exptectedPlayerList) {
    let args = [region, gameRoomId];
    args.push(...exptectedPlayerList);

    const subprocess = spawn(binPath, args, {
        detached: true,
        stdio: 'ignore',
    });

    subprocess.unref();

    global.redis.setexAsync(util.format(gameRoomKeyFormat, gameRoomId), 10, Date.now());
}

module.exports = router;
