'use strict';

var q = require('q');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('The configuration API controller', function() {

  var deps;
  var esnConfigMock;

  beforeEach(function() {
    var self = this;

    esnConfigMock = {};

    deps = {
      logger: { error: function() {} },
      'esn-config': esnConfigMock
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
      var req = {
        user: { _id: '123' },
        body: [{
          name: 'module1',
          keys: ['config1', 'config2']
        }, {
          name: 'module2',
          keys: ['config3']
        }],
        domain: {
          _id: 'domain123'
        }
      };
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

      deps['esn-config'] = function(configName) {
        return {
          inModule: function() {
            return {
              forUser: function(user) {
                expect(user).to.deep.equal(req.user);

                return {
                  get: function() {
                    return q(configName);
                  }
                };
              }
            };
          }
        };
      };

      this.requireController().getConfigurations(req, res);
    });

    it('should respond 400 if req.body is not an array', function(done) {
      var req = {
        body: 'not an array',
        domain: {
          _id: 'domain123'
        }
      };
      var res = {
        status: function(code) {
          expect(code).to.equal(400);

          return {
            json: function(data) {
              expect(data).to.deep.equal({
                error: {
                  code: 400,
                  message: 'Bad Request',
                  details: 'body should be an array'
                }
              });
              done();
            }
          };
        }
      };

      this.requireController().getConfigurations(req, res);
    });

    it('should respond 500 if server fails to get configurations', function(done) {
      var req = {
        user: { _id: '123' },
        body: [{
          name: 'some_module',
          keys: ['some_key']
        }],
        domain: {
          _id: 'domain123'
        }
      };
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

      deps['esn-config'] = function() {
        return {
          inModule: function() {
            return {
              forUser: function(user) {
                expect(user).to.deep.equal(req.user);

                return {
                  get: function() {
                    return q.reject(new Error('some_error'));
                  }
                };
              }
            };
          }
        };
      };

      this.requireController().getConfigurations(req, res);
    });

  });

  describe('The updateConfigurations fn', function() {

    it('should respond 204 if configurations are updated successfully', function(done) {
      var req = {
        body: [{
          name: 'some_module',
          configurations: [{ key: 'value' }]
        }],
        domain: {
          _id: 'domain123'
        }
      };
      var res = {
        status: function(code) {
          expect(code).to.equal(204);

          return {
            end: done
          };
        }
      };

      esnConfigMock.EsnConfig = function(moduleName, domainId) {
        expect(moduleName).to.equal(req.body[0].name);
        expect(domainId).to.equal(req.domain._id);

        this.setMultiple = function(configs) {
          expect(configs).to.deep.equal(req.body[0].configurations);

          return q();
        };
      };

      this.requireController().updateConfigurations(req, res);
    });

    it('should respond 400 if req.body is not an array', function(done) {
      var req = {
        body: 'not an array',
        domain: {
          _id: 'domain123'
        }
      };
      var res = {
        status: function(code) {
          expect(code).to.equal(400);

          return {
            json: function(data) {
              expect(data).to.deep.equal({
                error: {
                  code: 400,
                  message: 'Bad Request',
                  details: 'body should be an array'
                }
              });
              done();
            }
          };
        }
      };

      this.requireController().updateConfigurations(req, res);
    });

    it('should respond 500 if it fails to update configurations', function(done) {
      var req = {
        body: [{
          name: 'some_module',
          configurations: [{ key: 'value' }]
        }],
        domain: {
          _id: 'domain123'
        }
      };
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

      esnConfigMock.EsnConfig = function(moduleName, domainId) {
        expect(moduleName).to.equal(req.body[0].name);
        expect(domainId).to.equal(req.domain._id);

        this.setMultiple = function() {
          return q.reject(new Error('some_error'));
        };
      };

      this.requireController().updateConfigurations(req, res);
    });

    it('should call esnConf.setMultiple sequentially but not in parallel', function(done) {
      var setMultipleMock = sinon.stub().returns(q.reject(new Error('some_error')));
      var req = {
        body: [{
          name: 'module1',
          configurations: [{ key: 'value' }]
        }, {
          name: 'module2',
          configurations: [{ key: 'value' }]
        }],
        domain: {
          _id: 'domain123'
        }
      };
      var res = {
        status: function() {
          return {
            json: function() {
              // setMultiple fn is called only one time because it fails in the first call
              expect(setMultipleMock).to.have.been.calledOnce;
              done();
            }
          };
        }
      };

      esnConfigMock.EsnConfig = function() {
        this.setMultiple = setMultipleMock;
      };

      this.requireController().updateConfigurations(req, res);
    });

  });
});
