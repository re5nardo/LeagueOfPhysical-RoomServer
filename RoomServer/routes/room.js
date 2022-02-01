'use strict';
const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const util = require("util");
const portfinder = require('portfinder');
const uuid = require('uuid');
const ResponseBase = require('../models/response/response_base');

portfinder.basePort = 40000;    // default: 8000
portfinder.highestPort = 50000; // default: 65535

const SpawnRoomResponse = require('../models/response/spawn_room_response');

const roomKeyFormat = `room:%s`;

const binPath = 'C:\\Users\\USER\\Desktop\\lop-server-window\\LeagueOfPhysical_Server.exe';

router.get('/', function (req, res) {
    createRoom(req, res);
});

router.put('/', function (req, res) {
    onRoomCreated(req, res);
});

router.delete('/:roomId', function (req, res) {
    onRoomDeleted(req, res);
});

async function createRoom(req, res) {
    //let args = [req.body.region, req.body.roomId, req.body.matchType, req.body.subGameId, req.body.mapId];
    //args.push(...exptectedPlayerList);
    
    try {
        const roomId = uuid.v4();
        const port = await portfinder.getPortPromise();
        let args = [roomId, 'TestMatch', port, 'Friendly', 'JumpWang', 'Space'];

        const subprocess = spawn(binPath, args, {
            detached: true,
            stdio: 'ignore',
        });

        subprocess.unref();

        //  Wait for room created
        const created = await checkRoomCreated(roomId, 5);
        if (created === true) {
            res.json(new SpawnRoomResponse(200, roomId));
        } else {
            res.json(new ResponseBase(400));
        }
    } catch (error) {
        console.error(error);
        res.json(new ResponseBase(400));
    }
}

async function onRoomCreated(req, res) {
    try {
        global.redis.setexAsync(util.format(roomKeyFormat, req.body.roomId), 10, JSON.stringify(req.body));
        res.json(new ResponseBase(200));
    } catch (error) {
        console.error(error);
        res.json(new ResponseBase(400));
    }
}

async function onRoomDeleted(req, res) {
    try {
        global.redis.delAsync(util.format(roomKeyFormat, req.params.roomId));
        res.json(new ResponseBase(200));
    } catch (error) {
        console.error(error);
        res.json(new ResponseBase(400));
    }
}

async function checkRoomCreated(roomId, timeout) {
    let elapsed = 0;
    while (elapsed < timeout) {
        const created = await global.redis.existsAsync(roomId);
        if (created === 1) {
            return true;
        }

        await resolveAfterSeconds(0.5);
        elapsed += 0.5;
    }

    return false;
}

function resolveAfterSeconds(sec) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(sec);
        }, sec * 1000);
    });
}

module.exports = router;
