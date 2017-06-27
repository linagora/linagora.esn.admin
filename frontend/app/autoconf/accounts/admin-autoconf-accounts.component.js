(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminAutoconfAccounts', {
    templateUrl: '/admin/app/autoconf/accounts/admin-autoconf-accounts.html',
    controller: 'adminAutoconfAccountsController',
    bindings: {
      accounts: '='
    }
  });
})(angular);
