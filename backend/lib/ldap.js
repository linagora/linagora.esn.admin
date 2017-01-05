'use strict';

const LdapAuth = require('ldapauth-fork');
const q = require('q');

function testAccessLdap(ldapConfig) {
  const deferred = q.defer();

  let ldapauth;
  let called = false;

  try {
    ldapauth = new LdapAuth(ldapConfig);
  } catch (err) {
    return q.reject(err);
  }

  ldapauth.on('error', (err) => {
    if (!called) {
      called = true;

      deferred.reject(err);
    }
  });

  ldapauth._adminBind((err) => {
    if (!called) {
      called = true;

      if (err) {
        return deferred.reject(err);
      }

      deferred.resolve();
    }
  });

  return deferred.promise;
}

module.exports = {
  testAccessLdap
};
