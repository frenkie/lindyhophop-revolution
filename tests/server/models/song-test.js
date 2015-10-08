var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Song = mongoose.model('Song');

describe('Song model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Song).to.be.a('function');
    });

    describe('validation', function () {

        it('should require, title, difficulty, chart', function (done) {
            Song.create({})
            .then(null, function (error) {
                expect(error.errors.title).to.exist;
                expect(error.errors.artist).to.exist;
                expect(error.errors.bpms).to.exist;
                expect(error.errors.offset).to.exist;
                expect(error.errors.music).to.exist;
                done();
            });
        });

    });

});
