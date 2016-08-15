'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminLdapController', function() {
  var $controller, $rootScope, $stateParams, $scope;
  var adminDomainConfigService;
  var CONFIG_NAME = 'ldap';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;

      $stateParams.domainId = 'domain123';
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminLdapController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  it('should get LDAP configuration from server on init', function() {
    var configs = [{ key: 'value' }];

    adminDomainConfigService.get = sinon.stub().returns($q.when(configs));

    var controller = initController();

    expect(controller.configs).to.deep.equal(configs);
    expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME);
  });

  describe('The save fn', function() {
    var configMock;

    beforeEach(function() {
      configMock = [{ name: 'name' }];

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should not call adminDomainConfigService.set to save configuration if nothing changed', function(done) {
      var controller = initController();
      var form = {
        $valid: true
      };

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.configs[0].deleted = false;
      controller.save(form).catch(function() {
        expect(adminDomainConfigService.set).to.have.not.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should not call adminDomainConfigService.set to save configuration if form is invalid', function(done) {
      var controller = initController();
      var form = {
        $valid: false
      };

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.configs[0].name = 'new name';
      controller.save(form).catch(function() {
        expect(adminDomainConfigService.set).to.have.not.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should call adminDomainConfigService.set to save configuration', function(done) {
      var controller = initController();
      var form = {
        $valid: true
      };

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.configs[0].name = 'new name';
      controller.save(form).then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, {
          name: CONFIG_NAME,
          value: controller.configs
        });
        done();
      });

      $scope.$digest();
    });
  });

  describe('The _qualifyConfigs fn', function() {
    var configMock, form;

    beforeEach(function() {
      configMock = [{name: 'test'}];

      form = {
        $valid: true
      };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should return old config object when saving fail', function(done) {
      var ctrl = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.reject());
      ctrl.configs[0].name = 'new name';
      ctrl.configs[0].deleted = false;

      ctrl.save(form).catch(function() {
        expect(adminDomainConfigService.set).to.have.been.calledOnce;

        expect(ctrl.configs).to.deep.equal(configMock);
        done();
      });

      $scope.$digest();
    });

    it('should return configs without any empty object and with deleted is true', function(done) {
      var ctrl = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      ctrl.configs = [{}, { name: 'ldap1', deleted: true }, { name: 'ldap2', deleted: false }];

      ctrl.save(form).then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledOnce;
        expect(ctrl.configs).to.deep.equal([{name: 'ldap2'}]);
        done();
      });

      $scope.$digest();
    });
  });

  describe('The addForm fn', function() {
    var configMock;

    beforeEach(function() {
      configMock = { key: 'value' };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should add an empty object to configs', function() {
      var ctrl = initController();

      ctrl.configs = [];
      ctrl.addForm();

      expect(ctrl.configs).to.deep.equal([{}]);
    });
  });

});
