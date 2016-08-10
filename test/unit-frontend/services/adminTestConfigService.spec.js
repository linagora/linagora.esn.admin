'use strict';

describe('The adminTestConfigService service', function() {

   var adminTestConfigService;
   var $httpBackend;

  beforeEach(function() {
    angular.mock.module('linagora.esn.admin');

    angular.mock.inject(function(_$httpBackend_, _adminTestConfigService_) {
      $httpBackend = _$httpBackend_;
      adminTestConfigService = _adminTestConfigService_;
    });
  });

  describe('The testSendEmail fn', function() {

    it('should send POST request to send test email API endpoint', function(done) {
      var mailConfig = { key: 'value' };
      var domainId = 'domain123';
      var toEmail = 'to@email';

      $httpBackend.expectPOST('/admin/api/test/domain/' + domainId + '/sendEmail', {
        to: toEmail,
        config: mailConfig
      }).respond(200);

      adminTestConfigService.testSendEmail(domainId, toEmail, mailConfig)
        .then(function() {
          done();
        });

      $httpBackend.flush();
    });
  });

 });
