const Promise = require('bluebird');
const request = require('request-promise');

const Project = require('./Project');
const baseUrl7 = "https://todoist.com/api/v7";
const baseUrl8 = "https://beta.todoist.com/API/v8";

/**
 * In charge of interacting with Todoist APIs.
 * https://developer.todoist.com/
 */

class TodoistClient {

    constructor(apiKey) {
        this.syncToken = "*";
        this.apiKey = apiKey;
    }

    async getProjectsMap() {
        const options = {
            method: 'GET',
            uri: `${baseUrl8}/projects`,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            },
            json: true
        };
        let projectsJsonList = await request(options);
        return projectsJsonList
            .map(proj => new Project(proj))
            .reduce((map, project) => {
                map.set(project.id, project);
                return map;
            }, new Map());
    }

    getLabels() {
        const options = {
            method: 'GET',
            uri: `${baseUrl8}/labels`,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            },
            json: true
        };
        return request(options);
    }

    getTasks() {
        const options = {
            method: 'GET',
            uri: `${baseUrl8}/tasks`,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            },
            json: true
        };
        return request(options);
    }

    fetchAllItems(items) {
        return Promise.map(items, this.fetchItem.bind(this));
    }

    fetchItem(item) {
        const options = {
            method: 'POST',
            uri: `${baseUrl7}/items/get`,
            body: {
                token: this.apiKey,
                item_id: item.id
            },
            json: true // Automatically stringifies the body to JSON
        };
        return request(options)
            .then(result => {
                return result.item;
            })
    }

    postCommand(commandList) {
        const options = {
            method: 'POST',
            uri: `${baseUrl7}/sync`,
            body: {
                token: this.apiKey,
                commands: commandList.getCommandBody()
            },
            json: true // Automatically stringifies the body to JSON
        };
        return request(options)
    }
}

module.exports = TodoistClient;