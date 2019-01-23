const TopQueueState = require('./TopQueueState');

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

    /**
     * @return object with two keys:
     * 1. candidate:
     */
    getTopQueueState() {
        /*
        TODO
        1. sort tasks by order
        2. find top task without due date
        3. check if it has topqueue label already
        4. check if any other task already had topqueue
        5. return both candidate and fakers
         */
    }
}

module.exports = Project;