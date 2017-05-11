'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The adminAutoconfController', function() {

  var $controller, $rootScope, $scope;
  var ADMIN_AUTOCONF_ACCOUNT_TEMPLATE;

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _ADMIN_AUTOCONF_ACCOUNT_TEMPLATE_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      ADMIN_AUTOCONF_ACCOUNT_TEMPLATE = _ADMIN_AUTOCONF_ACCOUNT_TEMPLATE_;
    });

  });

  function initController(scope, accounts) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminAutoconfAccountsController', { $scope: $scope }, { accounts: accounts });

    $scope.$digest();

    return controller;
  }

  describe('The showEmptyMessage function', function() {
    it('should return true if accounts array is undefined', function() {
      var controller = initController();

      expect(controller.showEmptyMessage()).to.be.true;
    });

    it('should return true if accounts array is empty', function() {
      var controller = initController(null, []);

      expect(controller.showEmptyMessage(controller.accounts)).to.be.true;
    });

    it('should return false if accounts array is not empty', function() {
      var controller = initController(null, [{}]);

      expect(controller.showEmptyMessage(controller.accounts)).to.be.false;
    });
  });

  describe('The addForm function', function() {
    var form;

    beforeEach(function() {
      form = {
        $setDirty: function() {}
      };
    });

    it('should add an account form to accounts array', function() {
      var controller = initController(null, []);

      controller.addForm(form);

      expect(controller.accounts).to.deep.equal([ADMIN_AUTOCONF_ACCOUNT_TEMPLATE]);
    });
  });

  describe('The remove function', function() {
    var form;

    beforeEach(function() {
      form = {
        $setDirty: function() {}
      };
    });

    it('should remove right account', function() {
      var account1 = { key: 'value1' };
      var account2 = { key: 'value2' };
      var account3 = { key: 'value3' };

      var controller = initController(null, [account1, account2, account3]);

      controller.remove(form, account2);

      expect(controller.accounts).to.deep.equal([account1, account3]);
    });
  });
});
