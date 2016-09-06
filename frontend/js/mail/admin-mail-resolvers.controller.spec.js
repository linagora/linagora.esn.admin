'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminMailResolversController', function() {
  var $controller, $rootScope, $scope;
  var resolvers;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    });

    resolvers = {};
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminMailResolversController', { $scope: $scope }, { resolvers: resolvers });

    $scope.$digest();

    return controller;
  }

  it('should initial all and whatsup in resolvers if resolvers empty', function() {
    var controller = initController();

    expect(controller.resolvers.all).to.deep.equal({ active: false });
  });

  it('should initial options for whatsup in resolvers if resolver metadata object in ADMIN_MAIL_AVAILABLE_RESOLVERS array has hasOptions equal true', function() {
    var controller = initController();

    expect(controller.resolvers.whatsup).to.deep.equal({ active: false, options: {} });
  });
});
