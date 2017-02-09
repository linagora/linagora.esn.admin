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

    $scope.$digest();

    return controller;
  }

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

});
