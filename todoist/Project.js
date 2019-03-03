const QueueTopState = require('./QueueTopState');

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

    getQueueTopState(queueTopId) {
        this.tasks.sort(taskOrderCompare);
        // find top task without due date field
        let candidate = this.tasks.find(this.meetsQueueTopRequirements.bind(this));
        let candidateId = candidate ? candidate.id : -1;
        // check if any other task already had topqueue
        let fakers = this.tasks.filter(task => {
            let isLabeledTopQueue = task['label_ids'].indexOf(queueTopId) !== -1;
            let isCandidate = task.id === candidateId;
            return isLabeledTopQueue && !isCandidate;
        });
        let queueTopState = new QueueTopState(candidate, fakers);
        this.logQueueTop(queueTopState);
        return queueTopState;
    }

    logQueueTop(queueTopState) {
        console.log(`Project ${this.name} (${this.id}):`);
        queueTopState.log('\t• ');
    }

    meetsQueueTopRequirements(task) {
        return task &&
            !('due' in task) &&
            task.indent === 1;
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