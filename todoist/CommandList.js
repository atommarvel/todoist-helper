const uuidv4 = require('uuid/v4');

class CommandList {
    constructor() {
        this.commands = [];
    }

    getCommandBody() {
        return JSON.stringify(this.commands);
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
        let labelIds = addIfMissing(task['label_ids'], labelId);
        this.createUpdateLabelCommand(task.id, labelIds);
    }

    pushRemoveLabelCommand(task, labelId) {
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