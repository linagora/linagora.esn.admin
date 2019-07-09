'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe('The ldap module', function() {
  let getModule;
  let ldapConfigMock;

  before(function() {
    getModule = () => require(this.moduleHelpers.modulesPath + '/backend/lib/ldap');
  });

  beforeEach(function() {
    ldapConfigMock = {};
  });

  describe('The testAccessLdap fn', function() {
    it('should reject an error if there is error while initialize LdapAuth instance', function(done) {
      const ldapAuthMock = function() {
        throw new Error('Something error');
      };

      mockery.registerMock('ldapauth-fork', ldapAuthMock);

      getModule().testAccessLdap(ldapConfigMock).catch(err => {
        expect(err.message).to.equal('Something error');

        done();
      });
    });

    it('should reject an error and close connection if there is error while LDAP server down', function(done) {
      const closeMock = sinon.spy();
      const ldapAuthMock = function() {
        return {
          _adminBind(cb) { return cb(); },
          on: (evt, listener) => listener(new Error('Something error')),
          close: closeMock
        };
      };

      mockery.registerMock('ldapauth-fork', ldapAuthMock);

      getModule().testAccessLdap(ldapConfigMock).catch(err => {
        expect(err.message).to.equal('Something error');
        expect(closeMock).to.have.been.calledWith();

        done();
      });
    });

    it('should reject an error when failed to access LDAP server', function(done) {
      const ldapAuthMock = function() {
        return {
          _adminBind: function(cb) {
            return cb(new Error('Something error'));
          },
          on: () => {},
          close: () => {}
        };
      };

      mockery.registerMock('ldapauth-fork', ldapAuthMock);

      getModule().testAccessLdap(ldapConfigMock).catch(err => {
        expect(err.message).to.equal('Something error');

        done();
      });
    });

    it('should eventually close connection upon successful completion', function(done) {
      const ldapAuthMock = {
        _adminBind(cb) { return cb(null); },
        on: () => {},
        close: sinon.spy()
      };

      mockery.registerMock('ldapauth-fork', function() {
        return ldapAuthMock;
      });

      getModule().testAccessLdap(ldapConfigMock).then(() => {
        expect(ldapAuthMock.close).to.have.been.calledWith();
        done();
      })
      .catch(err => done(err || 'should resolve'));
    });

    it('should resolve without error when access successfuly to LDAP server', function(done) {
      const ldapAuthMock = function() {
        return {
          _adminBind(cb) { return cb(null); },
          on: function() {},
          close: () => {}
        };
      };

      mockery.registerMock('ldapauth-fork', ldapAuthMock);

      getModule().testAccessLdap(ldapConfigMock).then(() => {
        done();
      })
      .catch(err => done(err || 'should resolve'));
    });
  });
});
