const TodoistClient = require('./TodoistClient');
const QueueTopState = require('./QueueTopState');
const CommandList = require('./CommandList');


class QueueTopRunner {

    constructor(locals) {
        console.log(`Running job with the following locals:`);
        console.log(locals);
        this.locals = new TopQueueLocals(locals);
        this.client = new TodoistClient(this.locals.getTodoistApiKey());
    }

    async invoke() {
        let topQueueStateMerged = await this.compileTopQueueState();
        let commandList = new CommandList();
        topQueueStateMerged.candidates.forEach(candidate => {
            commandList.pushAddLabelCommand(candidate, this.locals.getQueueTopId());
        });
        topQueueStateMerged.fakes.forEach(faker => {
            commandList.pushRemoveLabelCommand(faker, this.locals.getQueueTopId());
        });
        if (commandList.getCommandCount() === 0) {
            console.log("No commands to post.");
        } else {
            this.postCommandList(commandList);
        }
    }

    async postCommandList(commandList) {
        console.log("Posting command list:");
        console.log(commandList.getPrettyCommandBody());
        let result = await this.client.postCommand(commandList);
        console.log("Todoist response:");
        console.log(JSON.stringify(result, null, 2));
    }

    async compileTopQueueState() {
        let projects = await this.client.getProjectsMap();
        let tasks = await this.client.getTasks();

        // insert tasks into their respective projects
        tasks.forEach(task => {
            projects.get(task.project_id).addTask(task);
        });

        this.filterIgnoredProjects(projects);

        // Combine together all the queueTop states from each project
        return Array.from(projects.values())
            .map(project => {
                return project.getQueueTopState(this.locals.getQueueTopId());
            })
            .reduce((merged, qTopState) => {
                return merged.mergeState(qTopState);
            }, new QueueTopState(null, []));
    }

    /**
     * Delete the projects that we are supposed to ignore
     */
    filterIgnoredProjects(projects) {
        for (let key of projects.keys()) {
            if (this.isProjectIgnored(key)) {
                projects.delete(key);
            }
        }
    }

    isProjectIgnored(projectId) {
        return this.locals.getIgnoredProjects().indexOf(projectId) !== -1;
    }
}

class TopQueueLocals {
    constructor(locals) {
        this.locals = locals;
    }

    getTodoistApiKey() {
        return this.locals.keys.todoist
    }

    getIgnoredProjects() {
        return this.locals.projectIgnores;
    }

    getQueueTopId() {
        return this.locals.queueTopId;
    }
}

module.exports = QueueTopRunner;