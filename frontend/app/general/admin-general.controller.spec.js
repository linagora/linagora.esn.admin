'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminGeneralController', function() {

  var $rootScope, $stateParams, $scope, $controller;
  var adminDomainConfigService;
  var configuraionsMock;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;

      $stateParams.domainId = 'domain123';
    });

    configuraionsMock = { datetime: 'value' };
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminGeneralController', { $scope: $scope });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('The $onInit fn', function() {
    it('should get a list of configurations from server on init', function() {
      adminDomainConfigService.getMultiple = sinon.stub().returns($q.when(configuraionsMock));
      var controller = initController();

      expect(controller.configs).to.deep.equal(configuraionsMock);
      expect(adminDomainConfigService.getMultiple).to.have.been.calledWith($stateParams.domainId, ['businessHours', 'datetime']);
    });
  });

  describe('The save fn', function() {
    it('should call adminDomainConfigService.setMultiple to save configuration', function() {
      adminDomainConfigService.getMultiple = function() {
        return $q.when(configuraionsMock);
      };
      adminDomainConfigService.setMultiple = sinon.stub().returns($q.when());

      var controller = initController();

      controller.configs.datetime = 'new value';
      var expectConfigsToUpdate = [{ name: 'datetime', value: 'new value' }];

      controller.save();
      $scope.$digest();

      expect(adminDomainConfigService.setMultiple).to.have.been.calledWith($stateParams.domainId, expectConfigsToUpdate);
    });
  });
});
