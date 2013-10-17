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
  var testImage = fs.readFileSync(path.join(__dirname,'/hotAir_small.jpg'));
  var loc = [37.800305,-122.409239];
  var year = 2013;
  var month = 11
  var day = 31;
  var date = new Date(year, month, day);
  date = date.toISOString();

  var options = JSON.stringify({
    location: loc,
    date: { year: year, month: month, day: day},
    maxD: 1
  });

  var evt = JSON.stringify({
    name: 'new years eve ball!',
    description: 'end the year with a bang',
    location: loc,
    time: date,
    photo: testImage,
    activity: 'party party',
    userId: 'abcdefghijklmn1234567'
  });

  beforeEach(function(done) {
    server.Event.remove({}, function() {
      request(server.app)
        .post('/api/createEvent')
        .set('content-type', 'application/json')
        .send(evt)
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
        console.log(typeof res);
        console.log(res.text)
        // assert.equal(res., 200);
        done();
      });
  });
});

