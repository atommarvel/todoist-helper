const uuidv4 = require('uuid/v4');

class CommandList {
    constructor() {
        this.commands = [];
    }

    getCommandCount() {
        return this.commands.length;
    }

    getCommandBody() {
        return JSON.stringify(this.commands);
    }

    getPrettyCommandBody() {
        return JSON.stringify(this.commands, null, 2);
    }

    pushAddUncompleteCommand(ids) {
        this.commands.push(
            new Command("item_uncomplete", {ids: ids})
        );
    }

    pushAddItemUpdateCommand(updates) {
        this.commands.push(
            new Command("item_update", updates)
        );
    }

    pushAddLabelCommand(task, labelId) {
        if (task['label_ids'].indexOf(labelId) !== -1) {
            return; // don't push a command since the given task already has the provided labelId
        }
        let labelIds = addIfMissing(task['label_ids'], labelId);
        this.createUpdateLabelCommand(task.id, labelIds);
    }

    pushRemoveLabelCommand(task, labelId) {
        if (task['label_ids'].indexOf(labelId) === -1) {
            return; // don't push a command since the given task already doesn't have the provided labelId
        }
        let labelIds = removeIfPresent(task['label_ids'], labelId);
        this.createUpdateLabelCommand(task.id, labelIds);
    }

    createUpdateLabelCommand(taskId, labels) {
        this.pushAddItemUpdateCommand({
            id: taskId,
            labels: labels
        });
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