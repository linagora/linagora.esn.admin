'use strict';

angular.module('linagora.esn.admin')

.component('adminUsersList', {
  templateUrl: '/admin/app/users/list/admin-users-list.html',
  controller: 'adminUsersListController',
  bindings: {
    domainId: '='
  }
});
