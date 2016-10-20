'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminWebController', function() {

  var $controller, $rootScope, $stateParams, $scope;
  var adminDomainConfigService;
  var CONFIG_NAME = 'web';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;

      $stateParams.domainId = 'domain123';
    });

  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminWebController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  it('should get Web configuration from server on init', function() {
    var config = { key: 'value' };

    adminDomainConfigService.get = sinon.stub().returns($q.when(config));

    var controller = initController();

    expect(controller.config).to.deep.equal(config);
    expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME);
  });

  describe('The save fn', function() {

    var configMock;

    beforeEach(function() {
      configMock = { key: 'value' };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should not call adminDomainConfigService.set to save configuration if form is invalid', function(done) {
      var controller = initController();
      var form = {
        $valid: false
      };

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.config.key = 'new value';
      controller.save(form).catch(function() {
        expect(adminDomainConfigService.set).to.have.not.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should call adminDomainConfigService.set to save configuration', function(done) {
      var controller = initController();
      var form = {
        $valid: true,
        $pristine: false,
        $setPristine: function() {
          form.$pristine = true;
        }
      };

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.config.key = 'new value';
      controller.save(form).then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME, controller.config);
        done();
      });

      $scope.$digest();
    });

    it('should make the form pristine when save successfully', function(done) {
      var controller = initController();
      var form = {
        $valid: true,
        $pristine: false,
        $setPristine: function() {
          form.$pristine = true;
        }
      };

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.save(form).then(function() {
        expect(form.$pristine).to.be.true;
        done();
      });

      $scope.$digest();
    });

  });

});
