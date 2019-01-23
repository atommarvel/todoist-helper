const TopQueueState = require('./TopQueueState');
const config = require('./todoist');

class Project {
    constructor(json) {
        this.id = json.id;
        this.indent = json.indent;
        this.name = json.name;
        this.order = json.order;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getTopQueueState() {
        this.tasks.sort(taskOrderCompare);
        // find top task without due date field
        let candidate = this.tasks.find(task => {
            return !('due' in task);
        });
        let candidateId = -1;
        if (candidate) {
            candidateId = candidate.id;
        }
        // check if any other task already had topqueue
        let fakers = this.tasks.filter(task => {
            let isLabeledTopQueue = task['label_ids'].indexOf(config.topQueueId) !== -1;
            let isCandidate = task.id === candidateId;
            return isLabeledTopQueue && !isCandidate;
        });
        return new TopQueueState(candidate, fakers);
    }
}

function taskOrderCompare(a,b) {
    if (a.order < b.order) {
        return -1
    }
    if (a.order > b.order) {
        return 1;
    }
    return 0;
}

module.exports = Project;