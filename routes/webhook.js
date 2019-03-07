const Promise = require('bluebird');
const express = require('express');
const request = require('request-promise');
const router = express.Router();
const kue = require('kue');
const queue = Promise.promisifyAll(kue.createQueue());

const RECEPTIONIST_BASE_URL = process.env.RECEPTIONIST_WEBHOOK_BASE_URL;
const CLEANUP_JOB_TYPE = 'cleanTodoist';
const DELAY_MS = process.env.RECEPTIONIST_WEBHOOK_DELAY;

queue.process(CLEANUP_JOB_TYPE, async (job, done) => {
    await cleanTodoist();
    done();
});

router.post('/', async function (req, res) {
    console.log("hooked!");
    const shouldSchedule = await isJobQueueClear();
    if (shouldSchedule) {
        console.log("scheduling...");
        scheduleJob();
    } else {
        console.log("no need to schedule");
    }
    res.sendStatus(200);
});

async function isJobQueueClear() {
    const total = await queue.delayedCountAsync();
    return total === 0;
}

async function cleanTodoist() {
    console.log("run cleanTodoist");
    const options = {
        method: 'GET',
        uri: `${RECEPTIONIST_BASE_URL}/api/job/queueTop`,
        qs: {
            'projectIgnores': process.env.RECEPTIONIST_WEBHOOK_PROJ_IGNORES,
            'queueTopId': process.env.RECEPTIONIST_WEBHOOK_QUEUE_TOP_ID
        },
        headers: {
            'Todoist-Api-Key': process.env.RECEPTIONIST_WEBHOOK_TODOIST_API_KEY
        },
        json: true
    };
    await request(options).then(console.log);
}

function scheduleJob() {
    queue.create('cleanTodoist').delay(DELAY_MS).save();
}

module.exports = router;
