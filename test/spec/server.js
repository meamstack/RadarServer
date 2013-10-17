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

describe('api event: create and find', function () {
  var evt = {
    testImage: fs.readFileSync(path.join(__dirname,'/hotAir_small.jpg')),
    loc: [37.800305,-122.409239],
    year: 2013,
    month: 11,
    day: 31,
    name: 'new years eve ball!',
    desc: 'end the year with a bang',
    uid: 'abcdefghijklmn1234567'
  };
  evt.date = new Date(evt.year, evt.month, evt.day);
  evt.date = evt.date.toISOString();

  var anotherEvt = {
    testImage: fs.readFileSync(path.join(__dirname,'/hotAir_small.jpg')),
    loc: [37.6,-122],
    year: 2013,
    month: 11,
    day: 30,
    name: 'spike\'s new haircut party',
    desc: 'see his hair go away',
    uid: 'zbcdefghijklmn1234567'
  };
  anotherEvt.date = new Date(anotherEvt.year, anotherEvt.month, anotherEvt.day);
  anotherEvt.date = anotherEvt.date.toISOString();

  var evtDetails = JSON.stringify({
    name: evt.name,
    description: evt.desc,
    location: evt.loc,
    time: evt.date,
    photo: evt.testImage,
    activity: 'party party',
    userId: evt.uid
  });

  var anotherEvtDetails = JSON.stringify({
    name: anotherEvt.name,
    description: anotherEvt.desc,
    location: anotherEvt.loc,
    time: anotherEvt.date,
    photo: anotherEvt.testImage,
    activity: 'party party',
    userId: anotherEvt.uid
  });
  


  describe('api/createEvent', function () {
    it('should return a status code of 200', function (done) {
      server.Event.remove({}, function () {
        request(server.app)
          .post('/api/createEvent')
          .set('content-type', 'application/json')
          .send(evtDetails)
          .end(function(err, res) {
            assert.equal(res.statusCode, 200);
            done();
          });
      });
    });
/**** this test must happen before the next text, needs the event that is created ****/
    it('should create an event', function (done) {
      server.Event.remove({}, function () {
        request(server.app)
          .post('/api/createEvent')
          .set('content-type', 'application/json')
          .send(evtDetails)
          .end(function(err, res) {
            assert.equal(res.text, 'event create');
            done();
          });
      });
    });
    it('should not create an event if it already exists', function (done) {
      request(server.app)
        .post('/api/createEvent')
        .set('content-type', 'application/json')
        .send(evtDetails)
        .end(function(err, res) {
          assert.equal(res.text, 'already created');
          done();
        });
    });
  });



  describe('api/findEvents', function () {
    var options = JSON.stringify({
      location: evt.loc,
      date: { year: evt.year, month: evt.month, day: evt.day},
      maxD: 1
    });
    beforeEach(function(done) {
      server.Event.remove({}, function () {
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
          var findEvt = JSON.parse(res.text)[0];
          assert.equal(findEvt.name, evt.name);
          assert.equal(findEvt.userId, evt.uid);
          // assert.equal(findEvt.location, evt.loc);
          done();
        });
    });
    it('should return multiple events if they meet criteria', function (done) {
      request(server.app)
        .post('/api/createEvent')
        .set('content-type', 'application/json')
        .send(anotherEvtDetails)
        .end(function(err, res) { 
          request(server.app)
            .post('/api/findEvents')
            .set('content-type', 'application/json')
            .send(options)
            .end(function(err, res) {
              var evt1 = JSON.parse(res.text)[0];
              var evt2 = JSON.parse(res.text)[1];
              assert.equal(evt1.name, evt.name);
              assert.equal(evt1.userId, evt.uid);
              assert.equal(evt2.name, anotherEvt.name);
              assert.equal(evt2.userId, anotherEvt.uid);
              done();
            });
        });
    });
  });
});