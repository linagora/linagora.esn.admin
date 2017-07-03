'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModulesDisplayerController', function() {
  var $controller, $rootScope, $scope, $stateParams;
  var adminDomainConfigService, asyncAction, adminModulesService, ADMIN_DEFAULT_NOTIFICATION_MESSAGES;

  beforeEach(function() {
    module('linagora.esn.admin', function($provide) {
      $provide.value('asyncAction', asyncAction = sinon.spy(function(message, action) {
        return action();
      }));
    });
  });

  beforeEach(function() {
    angular.mock.inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_, _adminModulesService_, _ADMIN_DEFAULT_NOTIFICATION_MESSAGES_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      adminDomainConfigService = _adminDomainConfigService_;
      adminModulesService = _adminModulesService_;
      $stateParams = _$stateParams_;
      ADMIN_DEFAULT_NOTIFICATION_MESSAGES = _ADMIN_DEFAULT_NOTIFICATION_MESSAGES_;
    });
  });

  function initController(module) {
    $scope = $rootScope.$new();

    var controller = $controller('adminModulesDisplayerController', { $scope: $scope }, { module: module });

    $scope.$digest();

    return controller;
  }

  describe('The setHome fn', function() {
    it('should call adminDomainConfigService.setHomePage to save configuration', function(done) {
      var module = {
        name: 'linagora.esn.test',
        homePage: 'test',
        configurations: []
      };
      var ctrl = initController(module);
      var HOMEPAGE_KEY = 'homePage';
      var event = {
        stopPropagation: angular.noop
      };

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      ctrl.setHome(event).then(function() {
        expect(asyncAction).to.have.been.calledWith(ADMIN_DEFAULT_NOTIFICATION_MESSAGES);
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, HOMEPAGE_KEY, module.homePage);
        expect(ctrl.currentHomepage).to.equal(module.homePage);
        done();
      });

      $scope.$digest();
    });
  });

  describe('The save fn', function() {
    it('should call adminConfigApi.set to save configuration', function(done) {
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'some_configs', value: 'some_value' }, { name: 'view' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'swipeRightAction' }, { name: 'drafts' }]};
      var ctrl = initController(module);
      var moduleConfig = [{
        name: 'linagora.esn.unifiedinbox',
        configurations: [{ name: 'some_configs', value: 'some_value' }, { name: 'view' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'swipeRightAction' }, { name: 'drafts' }]
      }];

      adminModulesService.set = sinon.stub().returns($q.when());
      $scope.form = {
        $setPristine: sinon.spy()
      };

      ctrl.save().then(function() {
        expect(asyncAction).to.have.been.calledWith(ADMIN_DEFAULT_NOTIFICATION_MESSAGES);
        expect(adminModulesService.set).to.have.been.calledWith($stateParams.domainId, moduleConfig);
        expect($scope.form.$setPristine).to.have.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should update original configuration', function() {
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'view' }, { name: 'api', value: 'some_value'}, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'swipeRightAction' }]};
      var ctrl = initController(module);

      adminModulesService.set = sinon.stub().returns($q.when());
      $scope.form = {
        $setPristine: sinon.spy()
      };
      $scope.$broadcast = sinon.spy();

      ctrl.save().then(function() {
        expect($scope.$broadcast).to.have.been.calledWith('ADMIN_FORM_RESET');
      });
    });
  });

  describe('The reset fn', function() {

    it('should make the form pristine', function() {
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'some_configs', value: 'some_value' }, { name: 'view' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'swipeRightAction' }]};
      var ctrl = initController(module);

      $scope.form = {
        $setPristine: sinon.spy()
      };

      ctrl.reset();

      expect($scope.form.$setPristine).to.have.been.called;
    });

    it('should broadcast admin:form:reset', function() {
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'view', value: 'some_value' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'swipeRightAction' }]};
      var ctrl = initController(module);

      $scope.form = {
        $setPristine: sinon.spy()
      };
      $scope.$broadcast = sinon.spy();

      ctrl.reset();

      expect($scope.$broadcast).to.have.been.calledWith('admin:form:reset');
    });
  });
});
