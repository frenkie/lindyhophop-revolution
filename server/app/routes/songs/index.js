var router = require('express').Router();
var Song = require('mongoose').model('Song');


router.get('/', function(req, res, next) {
  Song.find({}).then(function(songs) {
    res.send(songs);
  }).then(null, next);
});

router.get('/:id', function(req, res, next) {
  Song.findById(req.params.id).then(function(song) {
    res.send(song);
  }).then(null, next);
});



module.exports = router;