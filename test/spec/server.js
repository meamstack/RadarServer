var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var async = require('async');
var Q = require('q');
var request = require('supertest');
var server = require('../../server.js');

describe('Root page', function () {


  // beforeEach(function(done) {

  // });

  it('should return a status code of 200', function (done) {
    request(server.app)
      .get('/')
      .end(function(err, res) {
        assert.equal(res.statusCode, 200);
      });
  });
});
