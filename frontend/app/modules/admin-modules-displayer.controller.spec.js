'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModulesDisplayerController', function() {
  var $controller, $rootScope, $scope, adminDomainConfigService, asyncAction, adminModulesApi, $stateParams;

  beforeEach(function() {
    module('linagora.esn.admin', function($provide) {
      $provide.value('asyncAction', asyncAction = sinon.spy(function(message, action) {
        return action();
      }));
    });
  });

  beforeEach(inject(function(_$controller_, _$rootScope_, _adminDomainConfigService_, _adminModulesApi_, _$stateParams_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      adminDomainConfigService = _adminDomainConfigService_;
      adminModulesApi = _adminModulesApi_;
      $stateParams = _$stateParams_;
    })
  );

  function initController(module) {
    $scope = $rootScope.$new();

    var controller = $controller('adminModulesDisplayerController', { $scope: $scope }, { module: module});

    $scope.$digest();

    return controller;
  }

  it('should add feature when it\'s not in database', function() {

    var module = {name: 'linagora.esn.unifiedinbox', configurations: [{name: 'view'}, {name: 'api'}]};
    var ctrl = initController(module);
    var expectConfigurations = [{name: 'view'}, {name: 'api'}, {name: 'uploadUrl'}, {name: 'downloadUrl'}, {name: 'isJmapSendingEnabled'}, {name: 'isSaveDraftBeforeSendingEnabled'}, {name: 'composer.attachments'}, {name: 'maxSizeUpload'}, {name: 'twitter.tweets'}, {name: 'swipeRightAction'}, {name: 'drafts'}];

    expect(ctrl.module.configurations).to.deep.equal(expectConfigurations);
  });

  describe('The setHome fn', function() {

    it('should call adminDomainConfigService.setHomePage to save configuration', function(done) {
      var module = {name: 'linagora.esn.contact', configurations: []};
      var ctrl = initController(module);
      var HOMEPAGE_KEY = 'homePage';
      var expectedState = 'contact';
      var event = {
        stopPropagation: angular.noop
      };
      var message = 'Setting Contact as home';

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      ctrl.module.name = 'linagora.esn.contact';
      ctrl.setHome(event).then(function() {
        expect(asyncAction).to.have.been.calledWith(message);
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, HOMEPAGE_KEY, expectedState);
        expect(ctrl.currentHomepage).to.equal(expectedState);
        done();
      });

      $scope.$digest();
    });
  });

  describe('The Save fn', function() {

    it('should call adminConfigApi.set to save configuration', function(done) {
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'some_configs', value: 'some_value' }, { name: 'view' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'twitter.tweets' }, { name: 'swipeRightAction' }, { name: 'drafts' }]};
      var ctrl = initController(module);
      var moduleConfig = [{
        name: 'linagora.esn.unifiedinbox',
        configurations: [{ name: 'some_configs', value: 'some_value' }, { name: 'view' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'twitter.tweets' }, { name: 'swipeRightAction' }, { name: 'drafts' }]
      }];
      var message = 'Modification of Unified Inbox module\'s settings';

      adminModulesApi.set = sinon.stub().returns($q.when());
      $scope.form = {
        $setPristine: sinon.spy()
      };

      ctrl.save().then(function() {
        expect(asyncAction).to.have.been.calledWith(message);
        expect(adminModulesApi.set).to.have.been.calledWith($stateParams.domainId, moduleConfig);
        expect($scope.form.$setPristine).to.have.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should update original configuration', function() {
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'view' }, { name: 'api', value: 'some_value'}, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'twitter.tweets' }, { name: 'swipeRightAction' }]};
      var ctrl = initController(module);

      adminModulesApi.set = sinon.stub().returns($q.when());
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
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'some_configs', value: 'some_value' }, { name: 'view' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'twitter.tweets' }, { name: 'swipeRightAction' }]};
      var ctrl = initController(module);

      $scope.form = {
        $setPristine: sinon.spy()
      };

      ctrl.reset();

      expect($scope.form.$setPristine).to.have.been.called;
    });

    it('should broadcast admin:form:reset', function() {
      var module = {name: 'linagora.esn.unifiedinbox', configurations: [{ name: 'view', value: 'some_value' }, { name: 'api' }, { name: 'uploadUrl' }, { name: 'downloadUrl' }, { name: 'isJmapSendingEnabled' }, { name: 'isSaveDraftBeforeSendingEnabled' }, { name: 'composer.attachments' }, { name: 'maxSizeUpload' }, { name: 'twitter.tweets' }, { name: 'swipeRightAction' }]};
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
