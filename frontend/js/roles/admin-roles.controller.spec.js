'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminRolesController', function() {

  var $controller, $rootScope, $stateParams, $scope;
  var domainAPI;

  beforeEach(module('linagora.esn.admin'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$stateParams_, _domainAPI_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $stateParams = _$stateParams_;
    domainAPI = _domainAPI_;
    $stateParams.domainId = 'domain123';
  }));

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminRolesController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  it('should get adminitrator list on init', function() {
    var administrators = ['admin1', 'admin2'];

    domainAPI.getAdministrators = sinon.stub().returns($q.when({ data: administrators }));

    var controller = initController();

    expect(controller.administrators).to.deep.equal(administrators);
    expect(domainAPI.getAdministrators).to.have.been.calledWith($stateParams.domainId);
  });

});
