var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var StepChart = mongoose.model('StepChart');

describe('StepChart model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(StepChart).to.be.a('function');
    });

    describe('validation', function () {

        it('should require, title, difficulty, chart', function (done) {
            StepChart.create({})
            .then(null, function (error) {
                expect(error.errors.title).to.exist;
                expect(error.errors.difficulty).to.exist;
                expect(error.errors.chart).to.exist;
                done();
            });
        });

    });

});
