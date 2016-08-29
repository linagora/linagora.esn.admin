'use strict';

var _ = require('lodash');
var q = require('q');
var expect = require('chai').expect;

describe('The configuration API controller', function() {

  var deps;
  var esnConfigMock;
  var DEFAULT_MODULE = 'core';

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

    it('should respond 200 with an array of found configurations on successful', function(done) {
      var configData = [
        { name: 'name1', value: 'value1' },
        { name: 'name2', value: 'value2' }
      ];
      var req = {
        user: { _id: '123' },
        body: {
          configNames: ['name1', 'name2', 'name3'],
          moduleName: 'some_module'
        },
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
          inModule: function(moduleName) {
            expect(moduleName).to.equal(req.body.moduleName);

            return {
              forUser: function(user) {
                expect(user).to.deep.equal(req.user);

                return {
                  get: function() {
                    var config = _.find(configData, { name: configName });

                    return q(config && config.value);
                  }
                };
              }
            };
          }
        };
      };

      this.requireController().getConfigurations(req, res);
    });

    it('should use DEFAULT_MODULE as module name if req.body.moduleName is not available', function(done) {
      var configData = [
        { name: 'name1', value: 'value1' },
        { name: 'name2', value: 'value2' }
      ];
      var req = {
        user: { _id: '123' },
        body: {
          configNames: ['name1', 'name2', 'name3']
        },
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
          inModule: function(moduleName) {
            expect(moduleName).to.equal(DEFAULT_MODULE);

            return {
              forUser: function(user) {
                expect(user).to.deep.equal(req.user);

                return {
                  get: function() {
                    var config = _.find(configData, { name: configName });

                    return q(config && config.value);
                  }
                };
              }
            };
          }
        };
      };

      this.requireController().getConfigurations(req, res);
    });

    it('should respond 400 if req.body.configNames is missing or not an array', function(done) {
      var req = {
        body: {
          configNames: 'not an array'
        },
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
                  details: 'configNames should be an array of configuration\'s name'
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
        body: {
          configNames: ['name1', 'name2', 'name3']
        },
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

    it('should respond 200 if configurations are updated successfully', function(done) {
      var req = {
        body: {
          configs: [{ key: 'value' }],
          moduleName: 'some_module'
        },
        domain: {
          _id: 'domain123'
        }
      };
      var res = {
        status: function(code) {
          expect(code).to.equal(200);

          return {
            json: function(data) {
              expect(data).to.deep.equal(req.body.configs);
              done();
            }
          };
        }
      };

      esnConfigMock.EsnConfig = function(moduleName, domainId) {
        expect(moduleName).to.equal(req.body.moduleName);
        expect(domainId).to.equal(req.domain._id);

        this.setMultiple = function(configs) {
          expect(configs).to.deep.equal(req.body.configs);

          return q();
        };
      };

      this.requireController().updateConfigurations(req, res);
    });

    it('should use DEFAULT_MODULE as module name if req.body.moduleName is not available', function(done) {
      var req = {
        body: {
          configs: [{ key: 'value' }]
        },
        domain: {
          _id: 'domain123'
        }
      };
      var res = {
        status: function(code) {
          expect(code).to.equal(200);

          return {
            json: function(data) {
              expect(data).to.deep.equal(req.body.configs);
              done();
            }
          };
        }
      };

      esnConfigMock.EsnConfig = function(moduleName, domainId) {
        expect(moduleName).to.equal(DEFAULT_MODULE);
        expect(domainId).to.equal(req.domain._id);

        this.setMultiple = function(configs) {
          expect(configs).to.deep.equal(req.body.configs);

          return q();
        };
      };

      this.requireController().updateConfigurations(req, res);
    });

    it('should respond 400 if req.body.configs is missing or not an array', function(done) {
      var req = {
        body: {
          configs: 'not an array'
        },
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
                  details: 'configs should be an array of configuration to update'
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
        body: {
          configs: [{ key: 'value' }],
          moduleName: 'some_module'
        },
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
        expect(moduleName).to.equal(req.body.moduleName);
        expect(domainId).to.equal(req.domain._id);

        this.setMultiple = function(configs) {
          expect(configs).to.deep.equal(req.body.configs);

          return q.reject(new Error('some_error'));
        };
      };

      this.requireController().updateConfigurations(req, res);
    });

  });
});
