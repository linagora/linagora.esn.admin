'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminAutoconfController', function() {

  var $controller, $rootScope, $stateParams, $scope;
  var ADMIN_AUTOCONF_TEMPLATE;
  var adminDomainConfigService;
  var CONFIG_NAME = 'autoconf';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_, _ADMIN_AUTOCONF_TEMPLATE_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;
      ADMIN_AUTOCONF_TEMPLATE = _ADMIN_AUTOCONF_TEMPLATE_;

      $stateParams.domainId = 'domain123';
    });

  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminAutoconfController', { $scope: $scope });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  it('should get Autoconf configuration from server on init', function() {
    var config = { key: 'value' };

    adminDomainConfigService.get = sinon.stub().returns($q.when(config));

    var controller = initController();

    expect(controller.config).to.deep.equal(config);
    expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME);
  });

  it('should get Autoconf configuration template on init if there is no configuration from server', function() {
    adminDomainConfigService.get = sinon.stub().returns($q.when());

    var controller = initController();

    expect(controller.config).to.deep.equal(ADMIN_AUTOCONF_TEMPLATE);
    expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME);
  });

  describe('The save function', function() {

    var configMock;

    beforeEach(function() {
      configMock = { key: 'value' };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should call adminDomainConfigService.set to save configuration', function(done) {
      var controller = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.config.key = 'new value';
      controller.save().then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME, controller.config);
        done();
      });

      $scope.$digest();
    });
  });
});
