var mongoose = require('mongoose');

var schema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Easy', 'Medium', 'Hard', 'Challenge'],
    required: true
  },
  chart: {
    type: Array,
    required: true
  }

});

mongoose.model('StepChart', schema);