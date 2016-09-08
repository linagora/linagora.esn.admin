'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModulesController', function() {
  var $controller, $rootScope, $stateParams, $scope;
  var adminConfigApi;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminConfigApi_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminConfigApi = _adminConfigApi_;

      $stateParams.domainId = 'domain123';
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminModulesController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  it('should get Modules configurations from server from init', function() {
    var modules = [{name: 'name', configurations: { key: 'key', value: 'value' }}];

    adminConfigApi.get = sinon.stub().returns($q.when(modules));

    var controller = initController();

    expect(controller.modules).to.deep.equal(modules);
    expect(adminConfigApi.get).to.have.been.calledWith($stateParams.domainId);
  });

  describe('The save fn', function() {
    var modulesMock;

    beforeEach(function() {
      modulesMock = [{name: 'name', configurations: { key: 'key', value: 'value' }}];

      adminConfigApi.get = function() {
        return $q.when(modulesMock);
      };
    });

    it('should not call adminConfigApi.set to save configuration if nothing changed', function(done) {
      var controller = initController();
      var form = {
        $valid: true
      };

      adminConfigApi.set = sinon.stub().returns($q.when);
      controller.save(form).catch(function() {
        expect(adminConfigApi.set).to.have.not.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should not call adminConfigApi.set to save configuration when form is invalid', function(done) {
      var controller = initController();
      var form = {
        $valid: false
      };

      adminConfigApi.set = sinon.stub().returns($q.when);
      controller.modules[0].name = 'new name';
      controller.save(form).catch(function() {
        expect(adminConfigApi.set).to.have.not.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should call adminConfigApi.set to save configuration', function(done) {
      var controller = initController();
      var form = {
        $valid: true
      };

      adminConfigApi.set = sinon.stub().returns($q.when());
      controller.modules[0].name = 'new value';
      controller.save(form).then(function() {
        expect(adminConfigApi.set).to.have.been.calledWith($stateParams.domainId, controller.modules);
        done();
      });

      $scope.$digest();
    });

  });

});
