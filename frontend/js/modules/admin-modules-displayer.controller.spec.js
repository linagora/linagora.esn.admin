'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModulesDisplayerController', function() {
  var $controller, $rootScope, $scope, adminDomainConfigService, $stateParams;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _adminDomainConfigService_, _$stateParams_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      adminDomainConfigService = _adminDomainConfigService_;
      $stateParams = _$stateParams_;
    });
  });

  function initController(module) {
    $scope = $rootScope.$new();

    var controller = $controller('adminModulesDisplayerController', { $scope: $scope }, { module: module});

    $scope.$digest();

    return controller;
  }

  it('should add feature when it\'s not in database', function() {

    var module = {name: 'linagora.esn.unifiedinbox', configurations: [{name: 'view'}, {name: 'api'}]};
    var ctrl = initController(module);
    var expectConfigurations = [{name: 'view'}, {name: 'api'}, {name: 'uploadUrl'}, {name: 'downloadUrl'}, {name: 'isJmapSendingEnabled'}, {name: 'isSaveDraftBeforeSendingEnabled'}, {name: 'composer.attachments'}, {name: 'maxSizeUpload'}, {name: 'twitter.tweets'}, {name: 'swipeRightAction'}];

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

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      ctrl.module.name = 'linagora.esn.contact';
      ctrl.setHome(event).then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, HOMEPAGE_KEY, expectedState);
        expect(ctrl.currentHomepage).to.equal(expectedState);
        done();
      });

      $scope.$digest();
    });
  });

});
