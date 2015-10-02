var mongoose = require('mongoose');

var schema = new mongoose.Schema({

  chart: {
    type: Array,
    required: true
  }

});

mongoose.model('StepChart', schema);