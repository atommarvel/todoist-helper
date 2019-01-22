const Promise = require('bluebird');
const request = require('request-promise');

const CommandList = require('./CommandList');
const config = require('./todoist.json');
const baseUrl7 = "https://todoist.com/api/v7";
const baseUrl8 = "https://beta.todoist.com/API/v8";

/**
 * In charge of interacting with Todoist APIs.
 * https://developer.todoist.com/
 */

class TodoistClient {

    constructor() {
        this.syncToken = "*";
    }

    /**
     * Found under Settings > Integrations > API token
     */
    getAPIKey() {
        return config.apiKey;
    }

    getProjectDirectory() {
        const options = {
            method: 'GET',
            uri: `${baseUrl8}/projects`,
            headers: {
                'Authorization': `Bearer ${this.getAPIKey()}`
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
                'Authorization': `Bearer ${this.getAPIKey()}`
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
                token: this.getAPIKey(),
                item_id: item.id
            },
            json: true // Automatically stringifies the body to JSON
        };
        return request(options)
            .then(result => {
                console.log(`filled '${result.item.content}'`);
                return result.item;
            })
    }

    postCommand(commandList) {
        const options = {
            method: 'POST',
            uri: `${baseUrl7}/sync`,
            body: {
                token: this.getAPIKey(),
                commands: commandList.getCommandBody()
            },
            json: true // Automatically stringifies the body to JSON
        };
        return request(options)
    }
}

module.exports = new TodoistClient();