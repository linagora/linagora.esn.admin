'use strict';

module.exports = dependencies => {
  const { testAccessLdap } = dependencies('ldap');

  return {
    testAccessLdap
  };
};
