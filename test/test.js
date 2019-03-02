const Promise = require('bluebird');
const request = require('request-promise');

const TodoistClient = require('../todoist/TodoistClient');

const config = require('./todoist');
const ReceptionistBaseUrl = "http://localhost:3000";

async function logProjectIds() {
    const client = new TodoistClient(config.apiKey);
    let projects = await client.getProjectsMap();
    console.log(projects);
}

async function logLabelIds() {
    const client = new TodoistClient(config.apiKey);
    let labels = await client.getLabels();
    console.log(labels);
}

async function runQueueTop() {
    const options = {
        method: 'GET',
        uri: `${ReceptionistBaseUrl}/api/job/queueTop`,
        qs: {
            'projectIgnores': config.projectIgnores,
            'queueTopId': config.queueTopId
        },
        headers: {
            'Todoist-Api-Key': config.apiKey
        },
        json: true
    };
    return request(options).then(console.log);
}

runQueueTop();