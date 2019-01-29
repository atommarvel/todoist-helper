const TodoistRepository = require('./TodoistRepository');
const TopQueueState = require('./TopQueueState');
const CommandList = require('./CommandList');

/**
 * Strings together TodoistClient methods
 */
class TodoistWorker {

    constructor(resData) {
        this.resData = resData;
        this.repo = new TodoistRepository(resData);
    }

    async cleanUpTopQueueState() {
        let projects = await this.repo.getAllProjects();
        let tasks = await this.repo.getActiveTasks();
        // Categorize tasks into their projects
        tasks.forEach(task => {
            projects[task.project_id].addTask(task);
        });
        // Grab each project's TopQueueState then merge all of them together.
        let topQueueStateMerged = Object.values(projects)
            .map(project => {
                return project.getTopQueueState();
            })
            .reduce((merged, topQState) => {
                return merged.mergeState(topQState);
            }, new TopQueueState(null, []));

        let commandList = new CommandList();
        // Add topQueue label to all candidates
        topQueueStateMerged.candidates.forEach(candidate => {
            commandList.addLabelCommand(candidate, config.topQueueId);
        });
        // Remove topQueue label from all fakes
        topQueueStateMerged.fakes.forEach(faker => {
            commandList.removeLabelCommand(faker, config.topQueueId);
        });
        await this.repo.postCommand(commandList);
    }
}

module.exports = TodoistWorker;