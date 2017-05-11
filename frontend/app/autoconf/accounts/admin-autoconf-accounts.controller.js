(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminAutoconfAccountsController', adminAutoconfAccountsController);

  function adminAutoconfAccountsController($timeout, adminDomainConfigService, asyncAction, _, ADMIN_AUTOCONF_ACCOUNT_TEMPLATE) {
    var self = this;

    self.showEmptyMessage = showEmptyMessage;
    self.addForm = addForm;
    self.remove = remove;

    function showEmptyMessage(accounts) {
      if (!accounts || accounts.length === 0) {
        return true;
      }

      return false;
    }

    function addForm(form) {
      form.$setDirty();
      var newAccountConfig = angular.copy(ADMIN_AUTOCONF_ACCOUNT_TEMPLATE);

      self.accounts.unshift(newAccountConfig);
    }

    function remove(form, account) {
      form.$setDirty();

      var removeIndex = self.accounts.indexOf(account);

      self.accounts.splice(removeIndex, 1);
    }
  }
})(angular);
