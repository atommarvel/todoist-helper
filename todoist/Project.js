const TopQueueState = require('./QueueTopState');

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
        let candidateId = -1;
        if (candidate) {
            candidateId = candidate.id;
        }
        // check if any other task already had topqueue
        let fakers = this.tasks.filter(task => {
            let isLabeledTopQueue = task['label_ids'].indexOf(queueTopId) !== -1;
            let isCandidate = task.id === candidateId;
            return isLabeledTopQueue && !isCandidate;
        });
        if (candidate) {
            console.log(`adding ${candidate.content}`);
        }
        if (fakers.length > 0) {
            console.log(`removing ${fakers[0].id}`);
        }
        return new TopQueueState(candidate, fakers);
    }

    meetsQueueTopRequirements(task) {
        return !('due' in task) &&
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