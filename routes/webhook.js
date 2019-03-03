const Promise = require('bluebird');
const express = require('express');
const request = require('request-promise');
const router = express.Router();
const kue = require('kue');
const queue = Promise.promisifyAll(kue.createQueue());

const config = require('./webhookConfig');

const RECEPTIONIST_BASE_URL = "http://localhost:3000";
const CLEANUP_JOB_TYPE = 'cleanTodoist';
const DELAY_MS = 5000;

queue.process(CLEANUP_JOB_TYPE, async (job, done) => {
    await cleanTodoist();
    done();
});

router.get('/', async function (req, res) {
    const shouldSchedule = await isAnyJobScheduled();
    if (shouldSchedule) {
        scheduleJob();
    }
    res.sendStatus(200);
});

async function isAnyJobScheduled() {
    const total = await queue.delayedCountAsync();
    return total > 0;
}

async function cleanTodoist() {
    console.log("run cleanTodoist");
    const options = {
        method: 'GET',
        uri: `${RECEPTIONIST_BASE_URL}/api/job/queueTop`,
        qs: {
            'projectIgnores': config.projectIgnores,
            'queueTopId': config.queueTopId
        },
        headers: {
            'Todoist-Api-Key': config.apiKey
        },
        json: true
    };
    await request(options).then(console.log);
}

function scheduleJob() {
    queue.create('cleanTodoist').delay(DELAY_MS).save();
}

module.exports = router;
