'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminJamesController', function() {

  var $controller, $rootScope, $stateParams, $scope;
  var adminDomainConfigService, adminJamesClientProvider;
  var CONFIG_NAME = 'james';
  var $windowMock, jamesClientInstanceMock;

  beforeEach(function() {
    module('linagora.esn.admin');

    jamesClientInstanceMock = {
      getQuota: function() { return $q.when({}); },
      setQuota: function() { return $q.when(); }
    };

    $windowMock = {
      james: {
        Client: function() {
          return jamesClientInstanceMock;
        }
      }
    };

    angular.mock.module(function($provide) {
      $provide.value('$window', $windowMock);
    });

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_, _adminJamesClientProvider_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;
      adminJamesClientProvider = _adminJamesClientProvider_;

      $stateParams.domainId = 'domain123';
      adminJamesClientProvider.get = sinon.stub().returns($q.when(jamesClientInstanceMock));
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminJamesController', { $scope: $scope });

    controller.$onInit();

    $scope.$digest();

    return controller;
  }

  it('should get James configuration from server on init', function() {
    var config = { url: 'url' };

    adminDomainConfigService.get = sinon.stub().returns($q.when(config));

    var controller = initController();

    expect(controller.serverUrl).to.deep.equal(config.url);
    expect(controller.config).to.deep.equal({quota: { size: null, count: null }});
    expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME);
    expect(adminJamesClientProvider.get).to.have.been.calledWith($stateParams.domainId, config.url);
  });

  describe('The save fn', function() {

    var configMock;

    beforeEach(function() {
      configMock = { url: 'value' };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should call adminDomainConfigService.set to save configuration', function(done) {
      var controller = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.serverUrl = 'new value';
      controller.save().then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME, { url: 'new value' });
        done();
      });

      $scope.$digest();
    });

    it('should call james client to save quota configuration', function(done) {
      var controller = initController();

      adminDomainConfigService.set = function() {
        return $q.when();
      };
      jamesClientInstanceMock.setQuota = sinon.stub().returns($q.when());
      controller.config.quota = { size: -1, count: -1 };

      controller.save().then(function() {
        expect(jamesClientInstanceMock.setQuota).to.have.been.calledWith(controller.config.quota);
        done();
      });

      $scope.$digest();
    });
  });

  describe('The onServerUrlChange fn', function() {
    it('should reset connectionStatus and james config if server url on change', function() {
      adminDomainConfigService.get = sinon.stub().returns($q.when({}));
      var controller = initController();

      controller.onServerUrlChange();

      expect(controller.connectionStatus).to.equal('');
      expect(controller.config).to.deep.equal({});
    });
  });

  describe('The connect fn', function() {
    it('should set connectionStatus and james config if connect to server successfuly', function(done) {
      adminDomainConfigService.get = sinon.stub().returns($q.when({}));
      var controller = initController();

      controller.serverUrl = 'url';

      controller.connect().then(function() {
        expect(controller.connectionStatus).to.equal('connected');
        expect(controller.config).to.deep.equal({ quota: { size: null, count: null } });
        done();
      });

      $scope.$digest();
    });

    it('should reject if connect to server fail', function(done) {
      adminDomainConfigService.get = sinon.stub().returns($q.when({}));
      var controller = initController();

      controller.serverUrl = 'url';
      adminJamesClientProvider.get = sinon.stub().returns($q.reject());

      controller.connect().catch(function() {
        expect(controller.connectionStatus).to.equal('error');
        expect(controller.config).to.deep.equal({});
        done();
      });

      $scope.$digest();
    });
  });
});
