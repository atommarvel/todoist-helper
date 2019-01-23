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
            new Command("item_uncomplete", {ids: ids})
        );
    }

    addItemUpdateCommand(updates) {
        this.commands.push(
            new Command("item_update", updates)
        );
    }

    addLabelCommand(task, labelId) {
        let labelIds = addIfMissing(task['label_ids'], labelId);
        this.updateLabelCommand(task.id, labelIds);
    }

    removeLabelCommand(task, labelId) {
        let labelIds = removeIfPresent(task['label_ids'], labelId);
        this.updateLabelCommand(task.id, labelIds);
    }

    updateLabelCommand(taskId, labels) {
        this.addItemUpdateCommand({
            id: taskId,
            labels: labels
        });
    }

    createCommand(type, args) {
        return {
            uuid: uuidv4(),
            type: type,
            args: args
        }
    }
}

function addIfMissing(ids, id) {
    if (ids.indexOf(id) === -1) {
        ids.push(id);
    }
    return ids;
}

function removeIfPresent(ids, id) {
    return ids.filter(item => item !== id)
}

class Command {
    constructor(type, args) {
        this.uuid = uuidv4();
        this.type = type;
        this.args = args;
    }
}

module.exports = CommandList;