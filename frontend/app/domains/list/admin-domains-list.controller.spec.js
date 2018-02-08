'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminDomainsListController', function() {

  var $rootScope, $scope, $controller, $modalMock;
  var domainAPI, jamesWebadminClient, ADMIN_DOMAINS_EVENTS;
  var infiniteScrollHelperMock;
  var domain1, domain2;

  beforeEach(function() {
    infiniteScrollHelperMock = sinon.spy();
    domain1 = { id: 1, name: 'domain1.org', company_name: 'c1' };
    domain2 = { id: 2, name: 'domain2.org', company_name: 'c2' };
    $modalMock = sinon.spy();

    angular.mock.module(function($provide) {
      $provide.value('infiniteScrollHelper', infiniteScrollHelperMock);
      $provide.value('$modal', $modalMock);
    });
  });

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');

    inject(function(
      _$rootScope_,
      _$controller_,
      _domainAPI_,
      _jamesWebadminClient_,
      _ADMIN_DOMAINS_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      domainAPI = _domainAPI_;
      jamesWebadminClient = _jamesWebadminClient_;
      ADMIN_DOMAINS_EVENTS = _ADMIN_DOMAINS_EVENTS_;

      jamesWebadminClient.listDomains = function() {
        return $q.when([]);
      };
      jamesWebadminClient.createDomain = function() {
        return $q.when([]);
      };
    });

  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();
    $scope.$hide = angular.noop;

    var controller = $controller('adminDomainsListController', { $scope: $scope }, { elements: [domain2, domain1] });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  it('should call infiniteScrollHelper to load elements', function() {
    initController();

    expect(infiniteScrollHelperMock).to.have.been.called;
  });

  describe('on DOMAIN_CREATED event', function() {
    it('should add domain to the list', function() {
      domainAPI.list = sinon.stub().returns($q.when([]));
      var controller = initController();
      var domain3 = { id: 3, name: 'domain3.org', company_name: 'c3' };
      var expectResult = [domain3, domain2, domain1];

      $rootScope.$broadcast(ADMIN_DOMAINS_EVENTS.DOMAIN_CREATED, domain3);

      expect(controller.elements).to.deep.equal(expectResult);
    });

    it('should check the availability of the domain in James', function() {
      var domain = { id: 'domain_id', name: 'domain.com', company_name: 'My company' };

      jamesWebadminClient.listDomains = function() {
        return $q.when([domain.name]);
      };

      var controller = initController();

      controller.errors = {};
      controller.errors[domain.id] = 'some error';

      $rootScope.$broadcast(ADMIN_DOMAINS_EVENTS.DOMAIN_CREATED, domain);
      $scope.$digest();

      expect(controller.errors[domain.id]).to.be.undefined;
    });
  });

  describe('on DOMAIN_UPDATED event', function() {
    it('should update the corresponding domain in the list', function() {
      var controller = initController();
      var updatedDomain = { id: 2, name: 'domain2.org', company_name: 'c22' };
      var expectResult = [updatedDomain, domain1];

      $rootScope.$broadcast(ADMIN_DOMAINS_EVENTS.DOMAIN_UPDATED, updatedDomain);

      expect(controller.elements).to.deep.equal(expectResult);
    });

    it('should check the availability of the domain in James', function() {
      var domain = { id: 'domain_id', name: 'domain.com', company_name: 'My company' };

      jamesWebadminClient.listDomains = function() {
        return $q.when([domain.name]);
      };

      var controller = initController();

      controller.errors = {};
      controller.errors[domain.id] = 'some error';

      $rootScope.$broadcast(ADMIN_DOMAINS_EVENTS.DOMAIN_UPDATED, domain);
      $scope.$digest();

      expect(controller.errors[domain.id]).to.be.undefined;
    });
  });

  describe('The onFixBtnClick fn', function() {
    it('should check the availability of the given domain in James', function() {
      var domain = { id: 'domain_id', name: 'domain.com', company_name: 'My company' };

      jamesWebadminClient.listDomains = function() {
        return $q.when([domain.name]);
      };

      var controller = initController();

      controller.errors = {};
      controller.errors[domain.id] = 'some error';
      controller.onFixBtnClick(domain);
      $scope.$digest();

      expect(controller.errors[domain.id]).to.be.undefined;
    });

    it('should try creating James domain if it is unavailable', function() {
      var domain = { id: 'domain_id', name: 'domain.com', company_name: 'My company' };

      jamesWebadminClient.listDomains = function() {
        return $q.when([]);
      };
      jamesWebadminClient.createDomain = sinon.stub().returns($q.when());

      var controller = initController();

      controller.errors = {};
      controller.errors[domain.id] = 'some error';
      controller.onFixBtnClick(domain);
      $scope.$digest();

      expect(jamesWebadminClient.createDomain).to.have.been.calledWith(domain.name);
      expect(controller.errors[domain.id]).to.be.undefined;
    });
  });
});
