'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');

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

      getModule().testAccessLdap(ldapConfigMock).catch((err) => {
        expect(err.message).to.equal('Something error');

        done();
      });
    });

    it('should reject an error if there is error while LDAP server down', function(done) {
      const ldapAuthMock = function() {
        return {
          _adminBind: function(cb) {
            return cb();
          },
          on: (evt, listener) => listener(new Error('Something error'))
        };
      };

      mockery.registerMock('ldapauth-fork', ldapAuthMock);

      getModule().testAccessLdap(ldapConfigMock).catch((err) => {
        expect(err.message).to.equal('Something error');

        done();
      });
    });

    it('should reject an error when failed to access LDAP server', function(done) {
      const ldapAuthMock = function() {
        return {
          _adminBind: function(cb) {
            return cb(new Error('Something error'));
          },
          on: function() {}
        };
      };

      mockery.registerMock('ldapauth-fork', ldapAuthMock);

      getModule().testAccessLdap(ldapConfigMock).catch((err) => {
        expect(err.message).to.equal('Something error');

        done();
      });
    });

    it('should resolve without error when access successfuly to LDAP server', function(done) {
      const ldapAuthMock = function() {
        return {
          _adminBind: function(cb) {
            return cb(null);
          },
          on: function() {}
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
