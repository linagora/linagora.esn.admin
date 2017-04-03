'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModulesController', function() {
  var $controller, $rootScope, $stateParams, $scope;
  var adminConfigApi, adminDomainConfigService, esnModuleRegistry;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminConfigApi_, _adminDomainConfigService_, _esnModuleRegistry_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminConfigApi = _adminConfigApi_;
      adminDomainConfigService = _adminDomainConfigService_;
      esnModuleRegistry = _esnModuleRegistry_;

      $stateParams.domainId = 'domain123';
    });

    esnModuleRegistry.getAll = sinon.stub().returns({});
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminModulesController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  it('should get Modules configurations from server from init', function() {
    var modules = [{name: 'name', configurations: { key: 'key', value: 'value' }}];
    var homePage = 'state123';

    adminConfigApi.get = sinon.stub().returns($q.when(modules));
    adminDomainConfigService.get = sinon.stub().returns($q.when(homePage));

    var controller = initController();

    expect(controller.modules).to.deep.equal(modules);
    expect(adminConfigApi.get).to.have.been.calledWith($stateParams.domainId);
    expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, 'homePage');
  });

});
