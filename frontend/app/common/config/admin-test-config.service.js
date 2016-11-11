'use strict';

angular.module('linagora.esn.admin')

.factory('adminTestConfigService', function(adminRestangular) {

  function testSendEmail(domainId, to, mailConfig) {
    var body = { to: to, config: mailConfig };

    return adminRestangular
      .all('test')
      .one('domains', domainId)
      .one('sendEmail')
      .customPOST(body);
  }

  function testAccessLdap(domainId, ldapConfig) {
    var body = { config: ldapConfig };

    return adminRestangular
      .all('test')
      .one('domains', domainId)
      .one('accessLdap')
      .customPOST(body);
  }

  return {
    testSendEmail: testSendEmail,
    testAccessLdap: testAccessLdap
  };
});
