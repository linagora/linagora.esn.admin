'use strict';

var expect = require('chai').expect;

describe('The test API controller', function() {

  var deps;
  var emailModuleMock;

  beforeEach(function() {
    var self = this;

    emailModuleMock = {};

    deps = {
      email: emailModuleMock
    };

    self.requireController = function() {
      return require(self.moduleHelpers.modulesPath + '/backend/webserver/api/test/controller')(dependencies);
    };

  });

  function dependencies(name) {
    return deps[name];
  }

  describe('The testSendEmail fn', function() {

    it('should send test email with mail config provided in req.body and respond 200 on successful', function(done) {
      var req = {
        body: {
          to: 'to@email',
          config: { key: 'value' }
        }
      };
      var res = {
        status: function(code) {
          expect(code).to.equal(200);

          return {
            end: done
          };
        }
      };

      emailModuleMock.mailSenderBuilder = function(config) {
        expect(config).to.deep.equal(req.body.config);

        return {
          send: function(message, callback) {
            expect(message).to.deep.equal({
              to: req.body.to,
              subject: 'Test email from OpenPaas',
              html: 'Hello, this is test email sent by OpenPaas'
            });
            callback();
          }
        };
      };

      this.requireController().testSendEmail(req, res);
    });

    it('should respond 500 if server fails to send test email', function(done) {
      var req = {
        body: {
          to: 'to@email',
          config: { key: 'value' }
        }
      };
      var res = {
        status: function(code) {
          expect(code).to.equal(500);

          return {
            json: function(json) {
              expect(json).to.deep.equal({error: {code: 500, message: 'Server Error', details: 'some error'}});
              done();
            }
          };
        }
      };

      emailModuleMock.mailSenderBuilder = function() {
        return {
          send: function(message, callback) {
            callback(new Error('some error'));
          }
        };
      };

      this.requireController().testSendEmail(req, res);
    });

  });

});
