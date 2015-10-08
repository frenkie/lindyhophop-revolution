// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var StepChart = mongoose.model('StepChart');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Stepchart Route', function () {

  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('get all charts', function () {

    var agent;

    beforeEach('Create guest agent', function () {
      agent = supertest.agent(app);
    });

    beforeEach('Make a stepchart', function (done) {
      StepChart.create({
        "title": "Butterfly",
        "difficulty": "Beginner",
        "chart": [
          [
            [
              "0",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ]
      })
      .then(function () {
        done();
      }, done);
    });

    it('should get a 200 response', function (done) {
      agent.get('/api/stepcharts')
        .expect(200)
        .end(done);
    });

    it('should get the chart', function (done) {
      agent.get('/api/stepcharts')
        .expect(200)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.length(1);
          expect(res.body[0].title).to.equal("Butterfly");
          done();
        });
    });

  });

});
