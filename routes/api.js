var express = require('express');
var router = express.Router();


router.get('/job/topQueue', function(req, res, next) {
    res.set('Content-Type', 'application/json');
    res.sendStatus(200);
});
router.get('/job/upperCase', function(req, res, next) {
    res.set('Content-Type', 'application/json');
    res.sendStatus(200);
});


module.exports = router;
