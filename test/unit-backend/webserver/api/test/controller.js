'use strict';

const expect = require('chai').expect;

describe('The test API controller', function() {

  let deps;
  let emailModuleMock;
  let ldapModuleMock;

  beforeEach(function() {
    const self = this;

    emailModuleMock = {};

    deps = {
      email: emailModuleMock,
      ldap: ldapModuleMock
    };

    self.requireController = function() {
      return require(self.moduleHelpers.modulesPath + '/backend/webserver/api/test/controller')(dependencies);
    };

  });

  function dependencies(name) {
    return deps[name];
  }

  describe('The testSendEmail fn', function() {

    before(function() {
      ldapModuleMock = {
        testAccessLdap: () => Promise.reject(new Error('Something error'))
      };
    });

    it('should send test email with mail config provided in req.body and respond 200 on successful', function(done) {
      const req = {
        body: {
          to: 'to@email',
          config: { key: 'value' }
        }
      };
      const res = {
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
      const req = {
        body: {
          to: 'to@email',
          config: { key: 'value' }
        }
      };
      const res = {
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

  describe('The testAccessLdap fn', function() {
    context('respond 400 if ldapConfig is missing', function() {
      before(function() {
        ldapModuleMock = {
          testAccessLdap: () => Promise.reject(new Error('Something error'))
        };
      });

      it('should respond 400 if ldapConfig is missing in request', function(done) {
        const req = {
          body: {}
        };

        const res = {
          status: function(code) {
            expect(code).to.equal(400);

            return {
              json: function(json) {
                expect(json).to.deep.equal({error: {code: 400, message: 'Bad Request', details: 'The ldap\'s configuration is missing'}});
                done();
              }
            };
          }
        };

        this.requireController().testAccessLdap(req, res);
      });
    });

    context('respond 500 if error while connecting to LDAP', function() {
      before(function() {
        ldapModuleMock = {
          testAccessLdap: () => Promise.reject(new Error('Something error'))
        };
      });

      it('should respond 500 if there is error while connecting to LDAP server', function(done) {
        const req = {
          body: {
            config: { key: 'value' }
          }
        };

        const res = {
          status: function(code) {
            expect(code).to.equal(500);

            return {
              json: function(json) {
                expect(json).to.deep.equal({error: {code: 500, message: 'Server Error', details: 'Something error'}});
                done();
              }
            };
          }
        };

        this.requireController().testAccessLdap(req, res);
      });
    });

    context('respond 200 if connect successfully to ldap server', function() {
      before(function() {
        ldapModuleMock = {
          testAccessLdap: () => Promise.resolve(true)
        };
      });

      it('should respond 200 when access successfuly to ldap server', function(done) {
        const req = {
          body: {
            config: { key: 'value' }
          }
        };

        const res = {
          status: function(code) {
            expect(code).to.equal(200);

            return {
              end: done
            };
          }
        };

        this.requireController().testAccessLdap(req, res);
      });
    });
  });
});
