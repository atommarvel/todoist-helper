/**
 * Two Arrays:
 * candidate: task that should be given the label topQueue
 * fakes: tasks that should have the label topQueue removed
 */
class QueueTopState {
    constructor(candidate, fakes) {
        this.candidates = [];
        this.fakes = [];
        if (candidate) {
            this.addCandidate(candidate);
        }
        this.addFakes(fakes);
    }

    mergeState(topQueueState) {
        this.candidates = this.candidates.concat(topQueueState.candidates);
        this.fakes = this.fakes.concat(topQueueState.fakes);
        return this;
    }

    addCandidate(candidate) {
        this.candidates.push(candidate);
    }

    addFakes(fakes) {
        this.fakes = this.fakes.concat(fakes);
    }

    log(prefix) {
        const addPrefix = `${prefix}candidate: `;
        this.candidates.forEach(value => console.log(`${addPrefix}${value.content}`));
        const rmPrefix = `${prefix}fake: `;
        this.fakes.forEach(value => console.log(`${rmPrefix}${value.content}`));
    }
}

module.exports = QueueTopState;