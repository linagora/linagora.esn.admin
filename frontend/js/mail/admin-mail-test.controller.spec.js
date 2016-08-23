'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminMailTestController', function() {
  var $controller, $rootScope, $stateParams, $scope, ADMIN_MAIL_TRANSPORT_TYPES;
  var adminDomainConfigService, adminTestConfigService, adminMailService;
  var CONFIG_NAME = 'mail';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_, _adminTestConfigService_, _adminMailService_, _ADMIN_MAIL_TRANSPORT_TYPES_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;
      adminTestConfigService = _adminTestConfigService_;
      adminMailService = _adminMailService_;
      ADMIN_MAIL_TRANSPORT_TYPES = _ADMIN_MAIL_TRANSPORT_TYPES_;

      $stateParams.domainId = 'domain123';
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminMailTestController', { $scope: $scope });

    controller.mailto = 'someone@mail';
    controller.isMailConfigValid = true;
    $scope.$digest();

    return controller;
  }

  describe('The test fn', function() {
    var configMock, form;

    beforeEach(function() {
      configMock = { mail: {} };
      adminMailService.qualifyTransportConfig = function() {
        return configMock;
      };

      form = {
        $valid: true
      };
    });

    it('should not call adminTestConfigService.testSendEmail and push out the form invalid message if mail config form is invalid', function() {
      var controller = initController();
      controller.isMailConfigValid = false;

      controller.test(form);
      expect(controller.message.status).to.equal('invalidMailConfig');
    });

    it('should not call adminTestConfigService.testSendEmail and push out the mail invalid message if form is invalid', function() {
      var controller = initController();
      form.$valid = false;

      controller.test(form);
      expect(controller.message.status).to.equal('invalidEmail');
    });

    it('should call adminTestConfigService.testSendEmail to test configuration', function(done) {
      var controller = initController();
      var res = { config: { data: { to: ''} } };

      adminTestConfigService.testSendEmail = sinon.stub().returns($q.when(res));
      controller.test(form).then(function() {

        expect(adminTestConfigService.testSendEmail).to.have.been.calledWith($stateParams.domainId,
          controller.mailto, configMock);
        expect(controller.message.status).to.equal('success');
        done();
      });

      $scope.$digest();
    });

    it('should push out failed message if wrong configuration information', function() {
      var controller = initController();
      var err = {data: { error: {} } };

      adminTestConfigService.testSendEmail = sinon.stub().returns($q.reject(err));
      controller.test(form).catch(function() {

        expect(adminTestConfigService.testSendEmail).to.have.been.calledWith($stateParams.domainId,
          controller.mailto, configMock);
        expect(controller.message.status).to.equal('error');
      });

      $scope.$digest();
    });
  });
});
