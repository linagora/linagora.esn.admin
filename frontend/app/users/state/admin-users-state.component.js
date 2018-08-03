(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminUsersState', {
      templateUrl: '/admin/app/users/state/admin-users-state.html',
      bindings: {
        user: '<'
      }
    });
})(angular);
