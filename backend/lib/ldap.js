'use strict';

const LdapAuth = require('ldapauth-fork');
const q = require('q');
const NOOP = () => {};

function testAccessLdap(ldapConfig) {
  const deferred = q.defer();

  let ldapauth;
  let called = false;

  try {
    ldapauth = new LdapAuth(ldapConfig);
  } catch (err) {
    return q.reject(err);
  }

  ldapauth.on('error', err => {
    ldapauth.close(NOOP);

    if (!called) {
      called = true;

      deferred.reject(err);
    }
  });

  ldapauth._adminBind(err => {
    ldapauth.close(NOOP);

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
