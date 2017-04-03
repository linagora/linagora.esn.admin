'use strict';

var q = require('q');
var expect = require('chai').expect;

describe('The configuration API controller', function() {

  var deps;
  var esnConfigMock;

  beforeEach(function() {
    var self = this;

    esnConfigMock = {
      configurations: {
        getConfigurations: function() { return q.when(); },
        updateConfigurations: function() { return q.when(); }
      }
    };

    deps = {
      logger: { error: function() {} },
      'esn-config': esnConfigMock,
      auth: {}
    };

    self.requireController = function() {
      return require(self.moduleHelpers.modulesPath + '/backend/webserver/api/configuration/controller')(dependencies);
    };

  });

  function dependencies(name) {
    return deps[name];
  }

  describe('The getConfigurations fn', function() {

    it('should respond 200 with configurations of modules on successful', function(done) {
      var configData = [{
        name: 'module1',
        configurations: [
          { name: 'config1', value: 'config1'},
          { name: 'config2', value: 'config2'}
        ]
      }, {
        name: 'module2',
        configurations: [
          { name: 'config3', value: 'config3'}
        ]
      }];
      var req = { user: {} };
      var res = {
        status: function(code) {
          expect(code).to.equal(200);

          return {
            json: function(data) {
              expect(data).to.deep.equal(configData);
              done();
            }
          };
        }
      };

      esnConfigMock.configurations = {
        getConfigurations: function() { return q(configData); }
      };

      this.requireController().getConfigurations(req, res);
    });

    it('should respond 500 if server fails to get configurations', function(done) {
      var req = { user: {} };
      var res = {
        status: function(code) {
          expect(code).to.equal(500);

          return {
            json: function(data) {
              expect(data).to.deep.equal({
                error: {
                  code: 500,
                  message: 'Server Error',
                  details: 'some_error'
                }
              });
              done();
            }
          };
        }
      };

      esnConfigMock.configurations = {
        getConfigurations: function() { return q.reject(new Error('some_error')); }
      };

      this.requireController().getConfigurations(req, res);
    });

  });

  describe('The updateConfigurations fn', function() {

    it('should respond 204 if configurations are updated successfully', function(done) {
      var req = { user: {} };
      var res = {
        status: function(code) {
          expect(code).to.equal(204);

          return {
            end: done
          };
        }
      };

      this.requireController().updateConfigurations(req, res);
    });

    it('should respond 500 if it fails to update configurations', function(done) {
      var req = { user: {} };
      var res = {
        status: function(code) {
          expect(code).to.equal(500);

          return {
            json: function(data) {
              expect(data).to.deep.equal({
                error: {
                  code: 500,
                  message: 'Server Error',
                  details: 'some_error'
                }
              });
              done();
            }
          };
        }
      };

      esnConfigMock.configurations = {
        updateConfigurations: function() { return q.reject(new Error('some_error')); }
      };

      this.requireController().updateConfigurations(req, res);
    });

  });

  describe('The generateJwtKeyPair fn', function() {

    var authJwtMock;

    beforeEach(function() {
      authJwtMock = {};
      deps.auth = {
        jwt: authJwtMock
      };
    });

    it('should respond 200 with generated keys on success', function(done) {
      var keys = {
        publicKey: 'publicKey',
        privateKey: 'privateKey'
      };

      authJwtMock.generateKeyPair = function(callback) {
        callback(null, keys);
      };

      var req = {};
      var res = {
        status: function(code) {
          expect(code).to.equal(200);

          return {
            json: function(json) {
              expect(json).to.deep.equal(keys);
              done();
            }
          };
        }
      };

      this.requireController().generateJwtKeyPair(req, res);
    });

    it('should respond 500 on failure', function(done) {
      authJwtMock.generateKeyPair = function(callback) {
        callback(new Error('some_error'));
      };

      var req = {};
      var res = {
        status: function(code) {
          expect(code).to.equal(500);

          return {
            json: function(json) {
              expect(json).to.deep.equal({
                error: {
                  code: 500,
                  message: 'Server Error',
                  details: 'Cannot generate RSA keypair'
                }
              });
              done();
            }
          };
        }
      };

      this.requireController().generateJwtKeyPair(req, res);
    });

  });
});
