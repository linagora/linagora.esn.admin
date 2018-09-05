'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The adminLdapFormController', function() {

  var $rootScope, $scope, $controller;

  beforeEach(module('linagora.esn.admin'));

  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  function initController(scope, bindings) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminLdapFormController', { $scope: $scope }, bindings);

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('The $onInit fn', function() {

    it('should return default configuration values when configuration is undefined', function() {
      var bindings = {
        ldapConfig: {}
      };

      var controller = initController(null, bindings);

      expect(controller.ldapConfig.configuration).to.deep.equal({});
    });

    it('should return existing configuration values ', function() {
      var bindings = {
        ldapConfig: {
          configuration: {
            config1: 'value1',
            config2: 'value2'
          }
        }
      };

      var controller = initController(null, bindings);

      expect(controller.ldapConfig.configuration).to.deep.equal({config1: 'value1', config2: 'value2'});
    });

    it('should return default usage values when creating a new ldap config', function() {
      var bindings = { ldapConfig: {}};

      var defaultUsageValues = {
        auth: true,
        search: true,
        autoProvisioning: true
      };

      var controller = initController(null, bindings);

      expect(controller.ldapConfig.usage).to.deep.equal(defaultUsageValues);
    });

    it('should return existing ldap config', function() {
      var bindings = {
        ldapConfig: {
          usage: {
            auth: false,
            search: false,
            autoProvisioning: false
          }
        }
      };

      var controller = initController(null, bindings);

      expect(controller.ldapConfig).to.equal(bindings.ldapConfig);
    });

    it('should add autoProvisioning equal true', function() {
      var bindings = {
        ldapConfig: {
          usage: {
            auth: false,
            search: false
          }
        }
      };

      var controller = initController(null, bindings);

      expect(controller.ldapConfig.usage).to.deep.equal({auth: false, search: false, autoProvisioning: true});
    });
  });

  describe('The usernameField fn', function() {
    var controller;

    beforeEach(function() {
      var bindings = {
        ldapConfig: {
          configuration: {}
        }
      };

      controller = initController(null, bindings);
    });

    it('should return the username field converted from LDAP search filter on getter', function() {
      controller.ldapConfig.configuration.searchFilter = '(cn={{username}})';

      expect(controller.usernameField()).to.equal('cn');
    });

    it('should set the LDAP search filter on setter', function() {
      controller.usernameField('cn');

      expect(controller.ldapConfig.configuration.searchFilter).to.equal('(cn={{username}})');
    });
  });

  describe('The validatePort function', function() {
    var controller;

    beforeEach(function() {
      var bindings = {
        ldapConfig: {
          configuration: {}
        }
      };

      controller = initController(null, bindings);
    });

    it('should return false if the port config is invalid', function() {
      expect(controller.validatePort('ldap://172.18.0.8:9999999')).to.be.false;
    });

    it('should return true if the port config is valid', function() {
      expect(controller.validatePort('ldap://172.18.0.8:386')).to.be.true;
    });
  });

});
