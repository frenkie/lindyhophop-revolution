var mongoose = require('mongoose');

var schema = new mongoose.Schema({

  TITLE: {
    type: String,
    required: true
  },
  ARTIST: {
    type: String,
    required: true
  },
  BPMS: {
    type: String,
    required: true
  },
  DISPLAYBPM: {
    type: String
  },
  OFFSET: {
    type: String,
    required: true
  },
  MUSIC: {
    type: String,
    required: true
  },
  Charts: {
    Beginner: {
      _stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: [Number]
    },
    Easy: {
      _stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: [Number]
    },
    Medium: {
      _stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: [Number]
    },
    Hard: {
      _stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: [Number]
    },
    Challenge: {
      _stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: [Number]
    }
  }
});

mongoose.model('Song', schema);