var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var async = require('async');
var Q = require('q');
var request = require('supertest');
var server = require('../../server.js');
var fs = require('fs');
var path = require('path');

//need to have mongod Running

describe('Root page', function () {
  it('should return a status code of 200', function (done) {
    request(server.app)
      .get('/')
      .end(function(err, res) {
        assert.equal(res.statusCode, 200);
        done();
      });
  });
});

describe('login page', function () {
  it('should return a status code of 200', function (done) {
    request(server.app)
      .post('/login')
      .end(function(err, res) {
        assert.equal(res.statusCode, 200);
        done();
      });
  });
/*  it('should return false for a connect.sid cookie', function (done) {
    request(server.app)
      .post('/login')
      .send(JSON.stringify({}))
      .end(function(err, res) {
        assert.equal(res.body, false);
        done();
      })
  });*/
});

describe('facebook login', function () {
  it('should return a status code of 302', function (done) {
    request(server.app)
      .get('/auth/facebook')
      .end(function(err, res) {
        assert.equal(res.statusCode, 302);
        done();
      });
  });
});

describe('api/findEvents', function () {
  var evt = {}
  evt.testImage = fs.readFileSync(path.join(__dirname,'/hotAir_small.jpg'));
  evt.loc = [37.800305,-122.409239];
  evt.year = 2013;
  evt.month = 11
  evt.day = 31;
  evt.date = new Date(evt.year, evt.month, evt.day);
  evt.date = evt.date.toISOString();
  evt.name = 'new years eve ball!';
  evt.desc = 'end the year with a bang';
  evt.uid = 'abcdefghijklmn1234567';

  var options = JSON.stringify({
    location: evt.loc,
    date: { year: evt.year, month: evt.month, day: evt.day},
    maxD: 1
  });

  var evtDetails = JSON.stringify({
    name: evt.name,
    description: evt.desc,
    location: evt.loc,
    time: evt.date,
    photo: evt.testImage,
    activity: 'party party',
    userId: evt.uid
  });

  beforeEach(function(done) {
    server.Event.remove({}, function() {
      request(server.app)
        .post('/api/createEvent')
        .set('content-type', 'application/json')
        .send(evtDetails)
        .end(function(err, res) {
          done();
        });
    });
  });

  it('should return a status code of 200', function (done) {
    request(server.app)
      .post('/api/findEvents')
      .set('content-type', 'application/json')
      .send(options)
      .end(function(err, res) {
        assert.equal(res.statusCode, 200);
        done();
      });
  });
  it('should return the correct events', function (done) {
    request(server.app)
      .post('/api/findEvents')
      .set('content-type', 'application/json')
      .send(options)
      .end(function(err, res) {
        console.log(res);
        // assert.equal(res[0].name, evt.name);
        // assert.equal(res[0].userId, evt.uid);
        // assert.equal(res[0].date, evt.date);

        done();
      });
  });
});

