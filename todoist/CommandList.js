const uuidv4 = require('uuid/v4');

class CommandList {
    constructor() {
        this.commands = [];
    }

    getCommandBody() {
        return JSON.stringify(this.commands);
    }

    addUncompleteCommand(ids) {
        this.commands.push(
            this.createCommand("item_uncomplete", {ids: ids})
        );
    }

    addItemUpdateCommand(updates) {
        this.commands.push(
            this.createCommand("item_update", updates)
        );
    }

    createCommand(type, args) {
        return {
            uuid: uuidv4(),
            type: type,
            args: args
        }
    }
}

class Command {
    constructor(type, args) {
        this.reqObj = {
            uuid: uuidv4(),
            type: type,
            args: args
        };
    }
}

module.exports = CommandList;