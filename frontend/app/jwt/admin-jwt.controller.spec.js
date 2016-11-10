'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminJwtController', function() {

  var $controller, $rootScope, $stateParams, $scope;
  var adminConfigApi, adminDomainConfigService, esnFileSaver;
  var CONFIG_NAME = 'jwt';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminConfigApi_, _adminDomainConfigService_, _esnFileSaver_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;
      esnFileSaver = _esnFileSaver_;
      adminConfigApi = _adminConfigApi_;

      $stateParams.domainId = 'domain123';

      adminDomainConfigService.get = function() {
        return $q.when();
      };
    });

  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminJwtController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  describe('On init', function() {
    it('should get Jwt configuration from server on init', function() {
      var config = { key: 'value' };

      adminDomainConfigService.get = sinon.stub().returns($q.when(config));

      var controller = initController();

      expect(controller.config).to.deep.equal(config);
      expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME);
    });

    it('should convert expiration to number of days', function() {
      adminDomainConfigService.get = function() {
        return $q.when({ expiresIn: '15 days' });
      };

      var controller = initController();

      expect(controller.expiration).to.deep.equal(15);
    });

    it('should use undefined expiration in case the expiresIn config is missing', function() {
      adminDomainConfigService.get = function() {
        return $q.when({});
      };

      var controller = initController();

      expect(controller.expiration).to.not.be.defined;
    });

    it('should use undefined expiration in case the expiresIn config is not in the expected format', function() {
      adminDomainConfigService.get = function() {
        return $q.when({ expiresIn: '15 years' });
      };

      var controller = initController();

      expect(controller.expiration).to.not.be.defined;
    });
  });

  describe('The save fn', function() {

    var configMock;

    beforeEach(function() {
      configMock = { key: 'value' };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should call adminDomainConfigService.set to save configuration', function(done) {
      var controller = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.config.key = 'new value';
      controller.save().then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME, controller.config);
        done();
      });

      $scope.$digest();
    });

  });

  describe('The onExpirationChange fn', function() {

    it('should update the expiresIn with expiration', function() {
      var controller = initController();

      controller.config.expiresIn = '20 days';
      controller.expiration = 10;
      controller.onExpirationChange();

      expect(controller.config.expiresIn).to.equal('10 days');
    });

    it('should not update the expiresIn when expiration is null', function() {
      var controller = initController();

      controller.config.expiresIn = '20 days';
      controller.expiration = null;
      controller.onExpirationChange();

      expect(controller.config.expiresIn).to.equal('20 days');
    });

  });

  describe('The downloadPublicKey and downloadPrivateKey fn', function() {

    beforeEach(function() {
      var configMock = { publicKey: 'publicKey', privateKey: 'privateKey' };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should have downloadPublicKey fn to download public key', function() {
      var controller = initController();

      esnFileSaver.saveText = sinon.spy();

      controller.downloadPublicKey();

      expect(esnFileSaver.saveText).to.have.been.calledOnce;
      expect(esnFileSaver.saveText).to.have.been.calledWith(controller.config.publicKey, 'publicKey.txt');
    });

    it('should have downloadPrivateKey fn to download private key', function() {
      var controller = initController();

      esnFileSaver.saveText = sinon.spy();

      controller.downloadPrivateKey();

      expect(esnFileSaver.saveText).to.have.been.calledOnce;
      expect(esnFileSaver.saveText).to.have.been.calledWith(controller.config.privateKey, 'privateKey.txt');
    });

  });

  describe('The generate fn', function() {
    it('should call adminConfigApi.generateJwtKeyPair to generate new keys', function(done) {
      var data = {
        publicKey: 'publicKey',
        privateKey: 'privateKey'
      };

      adminConfigApi.generateJwtKeyPair = sinon.stub().returns($q.when({data: data}));

      var controller = initController();
      var form = { $setDirty: angular.noop };

      controller.generate(form).then(function() {
        expect(adminConfigApi.generateJwtKeyPair).to.have.been.calledWith($stateParams.domainId);
        expect(controller.config.publicKey).to.equal(data.publicKey);
        expect(controller.config.privateKey).to.equal(data.privateKey);
        done();
      });

      $scope.$digest();
    });

    it('should make the form dirty when keys are generated successfully', function(done) {
      adminConfigApi.generateJwtKeyPair = function() {
        return $q.when({ data: {} });
      };

      var controller = initController();
      var form = { $setDirty: sinon.spy() };

      controller.generate(form).then(function() {
        expect(form.$setDirty).to.have.been.calledWith();
        done();
      }, done.bind(null, 'should resolve'));

      $scope.$digest();
    });

    it('should not make the form dirty when keys are not generated successfully', function(done) {
      adminConfigApi.generateJwtKeyPair = function() {
        return $q.reject();
      };

      var controller = initController();
      var form = { $setDirty: sinon.spy() };

      controller.generate(form).then(done.bind(null, 'should reject'), function() {
        expect(form.$setDirty).to.not.have.been.called;
        done();
      });

      $scope.$digest();
    });
  });
});
