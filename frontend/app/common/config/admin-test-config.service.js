'use strict';

angular.module('linagora.esn.admin')

.factory('adminTestConfigService', function(adminRestangular) {

  function testSendEmail(domainId, to, mailConfig) {
    var body = { to: to, config: mailConfig };

    return adminRestangular
      .all('test')
      .one('domain', domainId)
      .one('sendEmail')
      .customPOST(body);
  }

  return {
    testSendEmail: testSendEmail
  };
});
