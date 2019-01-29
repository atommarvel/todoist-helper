const express = require('express');
const router = express.Router();

const TodoistWorker = require('../todoist/TodoistWorker');

router.get('/job/topQueue', async function(req, res, next) {
    let resData = new ResData(res);
    let worker = new TodoistWorker(resData);
    await worker.cleanUpTopQueueState();
    res.set('Content-Type', 'application/json');w2qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquyhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    res.sendStatus(200);
});

router.get('/job/upperCase', function(req, res, next) {
    res.set('Content-Type', 'application/json');
    res.sendStatus(200);
});

class ResData {
    constructor(res) {
        this.key = res.get('Todoist-API-Key');
        this.topQ = res.get('TopQueue-Label-ID');
        this.ignoreProj = res.get('TopQueue-Ignore-Projects');
        if (this.ignoreProj) {
            this.ignoreProj = this.ignoreProj.split(",");
        }
    }
}

module.exports = router;
