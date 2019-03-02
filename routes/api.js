const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const QueueTopRunner = require('./todoist/QueueTopRunner');
const ERR_PRECON_FAILED = 412;

function validateInputs(req, res, next) {
    // grab req params
    if (req.query.projectIgnores) {
        res.locals.projectIgnores = req.query.projectIgnores.split(',')
    }
    if (req.query.queueTopId) {
        res.locals.queueTopId = req.query.queueTopId;
    } else {
        return next(createError(ERR_PRECON_FAILED, "missing query param 'queueTopId'"));
    }
    next();
}

router.get('/job/topQueue', validateInputs, async function(req, res, next) {
    res.type('application/json');
    let runner = new QueueTopRunner(res.locals);
    await runner.invoke();
    res.sendStatus(200);
});

router.get('/job/upperCase', function(req, res, next) {
    res.type('application/json');
    res.sendStatus(200);
});


module.exports = router;
