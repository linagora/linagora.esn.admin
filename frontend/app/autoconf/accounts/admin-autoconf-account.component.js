(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminAutoconfAccount', {
    templateUrl: '/admin/app/autoconf/accounts/admin-autoconf-account.html',
    bindings: {
      account: '=',
      onRemoveBtnClick: '&'
    }
  });
})(angular);
