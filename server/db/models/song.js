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
      stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: Object
    },
    Easy: {
      stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: Object
    },
    Medium: {
      stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: Object
    },
    Hard: {
      stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: Object
    },
    Challenge: {
      stepChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StepChart'
      },
      level: Number,
      grooveRadar: Object
    }
  }
});

mongoose.model('Song', schema);