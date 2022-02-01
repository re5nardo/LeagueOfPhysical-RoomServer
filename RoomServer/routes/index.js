'use strict';
var express = require('express');
var router = express.Router();

const ResponseBase = require('../models/response/response_base');
const UserMatchState = require('../models/user_match_state');
const UserInfo = require('../models/user_info');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.put('/matchEnd', function (req, res) {
    onMatchEnd(req, res);
});

async function onMatchEnd(req, res) {

    const matchId = req.body.matchId;
    const matchSetting = req.body.matchSetting;

    const playerIds = req.body.playerIds;
    const winnerIds = req.body.winnerPlayerIds;
    const loserIds = req.body.loserPlayerIds;
    const rankDataList = req.body.rankingDataList;

    //  update userMatchState
    for (const playerId of req.body.playerIds) {
        try {
            const filter = {
                userId: playerId
            };

            const userMatchState = await UserMatchState.findOne(filter);
            userMatchState.state = '';
            userMatchState.stateValue = '';
            userMatchState.matchmakingTicketId = '';
            userMatchState.save();

        } catch (error) {
            console.error(error);
        }
    }

    res.json(new ResponseBase(200));

    
    ////  update userInfo
    //try {
    //    const filter = {
    //        userId: userId
    //    };

    //    const userInfo = await UserInfo.findOneAndUpdate(filter, update, options);
    //    userInfo.save();

    //} catch (error) {
    //    console.error(error);
    //}

    //res.json(new LeaveLobbyResponse(200));
}

module.exports = router;
