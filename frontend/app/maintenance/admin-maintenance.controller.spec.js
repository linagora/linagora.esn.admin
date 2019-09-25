'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminMaintenanceController', function() {
  var $controller, $rootScope, $scope;
  var adminMaintenanceService;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _adminMaintenanceService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      adminMaintenanceService = _adminMaintenanceService_;
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminMaintenanceController', { $scope: $scope });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('The $onInit function', function() {
    it('should get Modules configurations from server', function() {
      var maintenanceModules = [{ title: 'foo' }, { title: 'bar' }];

      adminMaintenanceService.getMaintenanceModules = sinon.stub().returns(maintenanceModules);

      var controller = initController();

      expect(controller.maintenanceModules).to.shallowDeepEqual(maintenanceModules);
      expect(adminMaintenanceService.getMaintenanceModules).to.have.been.calledOnce;
    });
  });
});
