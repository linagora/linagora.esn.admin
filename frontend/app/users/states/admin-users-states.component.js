(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminUsersStates', {
      templateUrl: '/admin/app/users/states/admin-users-states.html',
      bindings: {
        user: '='
      },
      controller: 'AdminUsersStatesController'
    });
})(angular);
