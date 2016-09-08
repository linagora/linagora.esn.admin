'use strict';

angular.module('linagora.esn.admin')

.component('adminRolesList', {
  templateUrl: '/admin/views/roles/list/admin-roles-list',
  bindings: {
    users: '=',
    template: '@',
    title: '@'
  }
});
