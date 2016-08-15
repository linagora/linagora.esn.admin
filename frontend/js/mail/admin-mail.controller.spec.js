'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminMailController', function() {
  var $controller, $rootScope, $stateParams, $scope, ADMIN_MAIL_TRANSPORT_TYPES;
  var adminDomainConfigService;
  var CONFIG_NAME = 'mail';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _$stateParams_, _adminDomainConfigService_, _ADMIN_MAIL_TRANSPORT_TYPES_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;
      ADMIN_MAIL_TRANSPORT_TYPES = _ADMIN_MAIL_TRANSPORT_TYPES_;

      $stateParams.domainId = 'domain123';
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminMailController', { $scope: $scope });

    $scope.$digest();

    return controller;
  }

  it('should get Mail configuration from server on init', function() {
    var config = {  mail: { noreply: 'value' }, transport: { module: 'module' } };
    adminDomainConfigService.get = sinon.stub().returns($q.when(config));

    var controller = initController();

    expect(controller.config).to.deep.equal(config);
    expect(adminDomainConfigService.get).to.have.been.calledWith($stateParams.domainId, CONFIG_NAME);
  });

  describe('The _getTransportType fn', function() {

    it('should return Local transport type if config object has module in transport attribute', function() {
      var config = { mail: { noreply: 'value' }, transport: {module: 'module', key: 'value'} };
      adminDomainConfigService.get = function() {
        return $q.when(config);
      };
      var controller = initController();

      expect(controller.transportType).to.equal(ADMIN_MAIL_TRANSPORT_TYPES[0]);
    });

    it('should return SMTP transport type if config object has host and port attribute in config attribute', function() {
      var config = { mail: { noreply: 'value' }, transport: {key: 'value', config: {host: '', port: 25, tls: {}, auth: { user: '', pass: '' } } } };
      adminDomainConfigService.get = sinon.stub().returns($q.when(config));
      var controller = initController();

      expect(controller.transportType).to.equal(ADMIN_MAIL_TRANSPORT_TYPES[1]);
    });

    it('should return Gmail transport type if config has service equal gmail', function() {
      var config = { mail: { noreply: 'value' }, transport: {key: 'value', config: {service: 'gmail', auth: { user: '', pass: '' } } } };
      adminDomainConfigService.get = sinon.stub().returns($q.when(config));
      var controller = initController();

      expect(controller.transportType).to.equal(ADMIN_MAIL_TRANSPORT_TYPES[2]);
    });

    it('should return Local transport type if config has service but service no equal gmail', function() {
      var config = { mail: { noreply: 'value' }, transport: {key: 'value', config: {service: 'nogmail'} } };
      adminDomainConfigService.get = sinon.stub().returns($q.when(config));
      var controller = initController();

      expect(controller.transportType).to.equal(ADMIN_MAIL_TRANSPORT_TYPES[0]);
    });

  });

  describe('The _qualifyTransportConfig fn', function() {
    var configMock, form;

    beforeEach(function() {
      configMock = {
        mail: {
          noreply: 'value'
        },
        transport: {
          module: 'value',
          config: {
            dir: 'value',
            browser: true,
            host: 'value',
            secure: false,
            tls: {
              rejectUnauthorized: false
            },
            port: 25,
            auth: {
              user: '',
              pass: ''
            },
            service: 'gmail'
          }
        }
      };

      form = {
        $valid: true
      };
      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should return old config object when saving fail', function(done) {
      var controller = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.reject());
      controller.transportType = ADMIN_MAIL_TRANSPORT_TYPES[0];
      controller.save(form).catch(function() {
        expect(controller.config).to.deep.equal(configMock);
        done();
      });

      $scope.$digest();
    });

    it('should return config object for Local transport type if transport type is Local and saving successfully', function(done) {
      var expectedConfig = {
        mail: { noreply: 'value' },
        transport: { module: 'value', config: { dir: 'new value', browser: true } }
      };
      var controller = initController();
      controller.config.transport.config.dir = 'new value';

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.transportType = ADMIN_MAIL_TRANSPORT_TYPES[0];
      controller.save(form).then(function() {
        expect(controller.config).to.deep.equal(expectedConfig);
        expect(adminDomainConfigService.set).to.be.calledWith($stateParams.domainId, {
          name: CONFIG_NAME,
          value: expectedConfig
        });
        done();
      });

      $scope.$digest();
    });

    it('should return config object for SMTP transport type if transport type is SMTP and saving successfully', function(done) {
      var expectedConfig = {
        mail: { noreply: 'value' },
        transport: {
          config: {
            host: 'new value',
            secure: false,
            tls: { rejectUnauthorized: false },
            port: 25,
            auth: { user: '', pass: '' }
          }
        }
      };
      var controller = initController();
      controller.config.transport.config.host = 'new value';

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.transportType = ADMIN_MAIL_TRANSPORT_TYPES[1];
      controller.save(form).then(function() {
        expect(controller.config).to.deep.equal(expectedConfig);
        expect(adminDomainConfigService.set).to.be.calledWith($stateParams.domainId, {
          name: CONFIG_NAME,
          value: expectedConfig
        });
        done();
      });

      $scope.$digest();
    });

    it('should return config object for Gmail transport type if transport type is Gmail and saving successfully', function(done) {
      var expectedConfig = {
        mail: { noreply: 'value' },
        transport: {
          config: { service: 'gmail', auth: { user: 'new value', pass: '' } }
        }
      };
      var controller = initController();
      controller.config.transport.config.auth.user = 'new value';

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.transportType = ADMIN_MAIL_TRANSPORT_TYPES[2];
      controller.save(form).then(function() {
        expect(controller.config).to.deep.equal(expectedConfig);
        expect(adminDomainConfigService.set).to.be.calledWith($stateParams.domainId, {
          name: CONFIG_NAME,
          value: expectedConfig
        });
        done();
      });

      $scope.$digest();
    });
  });

  describe('The save fn', function() {
    var configMock, form;

    beforeEach(function() {
      configMock = {
        mail: {
          noreply: 'value'
        },
        transport: {
          module: 'value',
          config: {
            dir: 'value',
            browser: true,
            host: 'value',
            secure: false,
            tls: {
              rejectUnauthorized: false
            },
            port: 25,
            auth: {
              user: '',
              pass: ''
            },
            service: 'gmail'
          }
        }
      };

      form = {
        $valid: true
      };

      adminDomainConfigService.get = function() {
        return $q.when(configMock);
      };
    });

    it('should not call adminDomainConfigService.set to save configuration if nothing changed', function(done) {
      var controller = initController();

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.save(form).catch(function() {
        expect(adminDomainConfigService.set).to.have.not.been.called;
        done();
      });

      $scope.$digest();
    });

    it('should not call adminDomainConfigService.set to save configuration if form is invalid', function(done) {
      var controller = initController();
      form.$valid = false;

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
      controller.config.transport.config.dir = 'new value';

      adminDomainConfigService.set = sinon.stub().returns($q.when());
      controller.save(form).then(function() {
        expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, {
          name: CONFIG_NAME,
          value: controller.config
        });
        done();
      });

      $scope.$digest();
    });
  });
});
