'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminWebserverController controller', function() {

  var $controller, $rootScope, $scope, adminDomainConfigService, ADMIN_MODE;
  var CONFIG_NAME = 'webserver';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _ADMIN_MODE_, _adminDomainConfigService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      adminDomainConfigService = _adminDomainConfigService_;
      ADMIN_MODE = _ADMIN_MODE_;
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminWebserverController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  it('should get Web configuration from server on init', function() {
    var config = { key: 'value' };

    adminDomainConfigService.get = sinon.stub().returns($q.when(config));

    var controller = initController();

    controller.$onInit();
    $rootScope.$digest();

    expect(controller.config).to.deep.equal(config);
    expect(adminDomainConfigService.get).to.have.been.calledWith(ADMIN_MODE.platform, CONFIG_NAME);
  });

  describe('The save fn', function() {
    var configMock;

    beforeEach(function() {
      configMock = { key: 'value' };
      adminDomainConfigService.get = sinon.stub().returns($q.when(configMock));
    });

    it('should call adminDomainConfigService.set to save configuration', function(done) {
      var controller = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.$onInit();
      $rootScope.$digest();

      controller.config.key = 'new value';
      controller.save().then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith(ADMIN_MODE.platform, CONFIG_NAME, controller.config);
        done();
      });

      $scope.$digest();
    });
  });

});
