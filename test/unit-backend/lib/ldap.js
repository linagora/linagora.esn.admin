'use strict';

const expect = require('chai').expect;

describe('The ldap module', function() {
  let getModule;
  let ldapMock, deps, ldapConfigMock;

  before(function() {
    const dependencies = name => deps[name];
    getModule = () => (require(this.moduleHelpers.modulesPath + '/backend/lib/ldap')(dependencies));
  });

  beforeEach(function() {
    ldapConfigMock = {};
    deps = {
      logger: {
        debug: function() {},
        info: function() {},
        error: function() {}
      },
      ldap: ldapMock
    };
  });

  describe('The testAccessLdap fn', function() {
    context('reject while initialize', function() {
      before(function() {
        ldapMock = {
          testAccessLdap: () => Promise.reject(new Error('Something error'))
        };
      });

      it('should reject an error if there is error while initialize LdapAuth instance', function(done) {
        before(function() {
          ldapMock = {
            testAccessLdap: () => Promise.reject(new Error('Something error'))
          };
        });
        getModule().testAccessLdap(ldapConfigMock).catch(err => {
          expect(err.message).to.equal('Something error');
          done();
        });
      });
    });

    context('reject when failed to access', function() {
      before(function() {
        ldapMock = {
          testAccessLdap: () => Promise.reject(new Error('Something error'))
        };
      });

      it('should reject an error when failed to access LDAP server', function(done) {

        getModule().testAccessLdap(ldapConfigMock).catch(err => {
          expect(err.message).to.equal('Something error');

          done();
        });
      });
    });

    context('resolve', function() {
      before(function() {
        ldapMock = {
          testAccessLdap: () => Promise.resolve(true)
        };
      });
      it('should resolve without error when access successfuly to LDAP server', function(done) {
        getModule().testAccessLdap(ldapConfigMock).then(() => {
          done();
        })
        .catch(err => done(err || 'should resolve'));
      });
    });
  });
});
