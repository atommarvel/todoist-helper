const Promise = require('bluebird');
const request = require('request-promise');

const CommandList = require('./CommandList');
const config = require('./todoist.json');
const baseUrl = "https://todoist.com/api/v7";

/**
 * In charge of interacting with Todoist APIs.
 * https://developer.todoist.com/
 */

class TodoistClient {

    constructor() {
        this.syncToken = "*";
    }

    getAPIKey() {
        return config.apiKey;
    }

    getCompletedBody() {
        // TODO: pagination, only look at last 7 days, limit 50
        return {
            token: this.getAPIKey()
        };
    }

    async test() {
        let dailyItems = await this.getAllCompletedDailyItems();
        let filledItems = await this.fetchAllItems(dailyItems);
        console.log("filled items:");
        console.log(filledItems);
        this.uncompleteItems(filledItems);
        this.setAllNonChildItemsDueToday(filledItems);
        console.log("finished")
    }

    getAllCompletedDailyItems() {
        const url = `${baseUrl}/completed/get_all`;
        const body = this.getCompletedBody();
        const options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true // Automatically stringifies the body to JSON
        };
        return request(options)
            .then(data => data.items)
            .then(items => items.filter(this.createItemLabelFilter("daily")));
    }

    createItemLabelFilter(label) {
        return function(item) {
            return item.content.indexOf(`@${label}`) !== -1;
        }
    }

    fetchAllItems(items) {
        return Promise.map(items, this.fetchItem.bind(this));
    }

    fetchItem(item) {
        const options = {
            method: 'POST',
            uri: `${baseUrl}/items/get`,
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

    uncompleteItems(items) {
        let commandList = new CommandList();
        let ids = items.map(item => item.id);
        commandList.addUncompleteCommand(ids);
        return this.postCommand(commandList);
    }

    setAllNonChildItemsDueToday(items) {
        let commandList = new CommandList();
        let nonChildItems = items.filter(item => item.indent === 1);
        nonChildItems.forEach(item => {
            commandList.addItemUpdateCommand({
                id: item.id,
                date_string: "today"
            })
        });
        return this.postCommand(commandList);
    }

    postCommand(commandList) {
        const options = {
            method: 'POST',
            uri: `${baseUrl}/sync`,
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