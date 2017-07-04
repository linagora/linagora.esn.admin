'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminDomainsListController', function() {

  var $rootScope, $scope, $controller;
  var domainAPI, ADMIN_DOMAINS_EVENTS;
  var infiniteScrollHelperMock;
  var domain;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
    domain = { name: 'abc' };

    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', infiniteScrollHelperMock);
    });
  });

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');

    inject(function(_$rootScope_, _$controller_, _domainAPI_, _ADMIN_DOMAINS_EVENTS_) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      domainAPI = _domainAPI_;
      ADMIN_DOMAINS_EVENTS = _ADMIN_DOMAINS_EVENTS_;
    });

  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();
    $scope.$hide = angular.noop;

    var controller = $controller('adminDomainsListController', { $scope: $scope }, { elements: [domain] });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initController();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });

  it('should update list domains when domain creation event fire', function() {
    domainAPI.list = sinon.stub().returns($q.when([]));
    var controller = initController();

    var domain2 = { name: 'domain2' };

    var expectResult = [domain2, domain];

    $rootScope.$broadcast(ADMIN_DOMAINS_EVENTS.DOMAIN_CREATED, domain2);

    expect(controller.elements).to.deep.equal(expectResult);
  });
});
