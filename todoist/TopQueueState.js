/**
 * Two Arrays:
 * candidates: tasks that should be given the label topQueue
 * fakes: tasks that should have the label topQueue removed
 */
class TopQueueState {
    constructor(candidates, fakes) {
        this.candidates = candidates;
        this.fakes = fakes;
    }

    mergeState(topQueueState) {
        this.candidates.concat(topQueueState.candidates);
        this.fakes.concat(topQueueState.fakes);
    }
}

module.exports = TopQueueState;