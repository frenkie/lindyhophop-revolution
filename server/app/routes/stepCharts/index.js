var router = require('express').Router();
var StepChart = require('mongoose').model('StepChart');


router.get('/', function(req, res, next) {
  StepChart.find({}).then(function(charts) {
    res.send(charts);
  }).then(null, next);
});

router.get('/:id', function(req, res, next) {
  StepChart.findById(req.params.id).then(function(chart) {
    res.send(chart);
  }).then(null, next);
});


module.exports = router;