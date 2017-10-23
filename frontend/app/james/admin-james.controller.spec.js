'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminJamesController', function() {

  var $controller, $rootScope, $stateParams, $scope;
  var adminDomainConfigService, adminJamesService, jamesClientProvider;
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

    inject(function(
      _$controller_,
      _$rootScope_,
      _$stateParams_,
      _adminDomainConfigService_,
      _jamesClientProvider_,
      _adminJamesService_
    ) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;
      jamesClientProvider = _jamesClientProvider_;
      adminJamesService = _adminJamesService_;

      $stateParams.domainId = 'domain123';
      jamesClientProvider.get = sinon.stub().returns($q.when(jamesClientInstanceMock));

      adminDomainConfigService.get = function() {
        return $q.when({});
      };
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
    var serverUrl = 'url';

    adminJamesService.getServerUrl = sinon.stub().returns($q.when(serverUrl));

    var controller = initController();

    expect(controller.serverUrl).to.deep.equal(serverUrl);
    expect(controller.config).to.deep.equal({quota: { size: null, count: null }});
    expect(adminJamesService.getServerUrl).to.have.been.calledOnce;
    expect(jamesClientProvider.get).to.have.been.calledWith(serverUrl);
  });

  describe('The save fn', function() {

    var configMock;

    beforeEach(function() {
      configMock = { url: 'value' };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should call James client to save James configuration', function(done) {
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
    it('should reset connectionStatus and James config if server URL on change', function() {
      var controller = initController();

      controller.onServerUrlChange();

      expect(controller.connectionStatus).to.equal('');
      expect(controller.config).to.deep.equal({});
    });
  });

  describe('The connect fn', function() {

    it('should call adminDomainConfigService.set to save James URL', function() {
      var controller = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.serverUrl = 'new value';

      controller.connect();
      $scope.$digest();

      expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME, { url: 'new value' });

    });

    it('should set connectionStatus to connected and James config if connect to server successfuly', function() {
      adminDomainConfigService.set = sinon.stub().returns($q.when());
      var controller = initController();

      controller.serverUrl = 'url';

      controller.connect();
      $scope.$digest();

      expect(controller.connectionStatus).to.equal('connected');
      expect(controller.config).to.deep.equal({ quota: { size: null, count: null } });
      expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME, { url: 'url' });
    });

    it('should set connectionStatus to error if connect successfuly but fails to save James URL', function() {
      var controller = initController();

      adminDomainConfigService.set = function() {
        return $q.reject({});
      };
      controller.serverUrl = 'url';

      controller.connect();
      $scope.$digest();

      expect(controller.connectionStatus).to.equal('error');
      expect(controller.config).to.deep.equal({});
    });

    it('should set connectionStatus to error if it fails to get James client', function() {
      var controller = initController();

      controller.serverUrl = 'url';
      jamesClientProvider.get = function() {
        return $q.reject({});
      };

      controller.connect();
      $scope.$digest();

      expect(controller.connectionStatus).to.equal('error');
      expect(controller.config).to.deep.equal({});
    });

    it('should set connectionStatus to error if it fails to get James config', function() {
      var controller = initController();

      controller.serverUrl = 'url';
      jamesClientInstanceMock.getQuota = sinon.stub().returns($q.reject());

      controller.connect();
      $scope.$digest();

      expect(jamesClientInstanceMock.getQuota).to.have.been.calledOnce;
      expect(controller.connectionStatus).to.equal('error');
      expect(controller.config).to.deep.equal({});
    });
  });
});
