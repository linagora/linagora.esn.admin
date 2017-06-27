'use strict';

angular.module('linagora.esn.admin')

.component('adminRolesList', {
  templateUrl: '/admin/app/roles/list/admin-roles-list.html',
  bindings: {
    users: '=',
    template: '@',
    title: '@'
  }
});
