'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModulesDisplayerController', function() {
  var $controller, $rootScope, $scope;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var module = {name: 'linagora.esn.unifiedinbox', configurations: [{name: 'view'}, {name: 'api'}]};

    var controller = $controller('adminModulesDisplayerController', { $scope: $scope }, { module: module});

    $scope.$digest();

    return controller;
  }

  it('should add feature when it\'s not in database', function() {
    var ctrl = initController();
    var expectConfigurations = [{name: 'view'}, {name: 'api'}, {name: 'uploadUrl'}, {name: 'downloadUrl'}, {name: 'isJmapSendingEnabled'}, {name: 'isSaveDraftBeforeSendingEnabled'}, {name: 'composer.attachments'}, {name: 'maxSizeUpload'}, {name: 'twitter.tweets'}, {name: 'swipeRightAction'}];

    expect(ctrl.module.configurations).to.deep.equal(expectConfigurations);
  });

});
