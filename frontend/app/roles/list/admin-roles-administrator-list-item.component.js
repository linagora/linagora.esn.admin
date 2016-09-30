'use strict';

angular.module('linagora.esn.admin')

.component('adminRolesAdministratorListItem', {
  templateUrl: '/admin/app/roles/list/admin-roles-administrator-list-item',
  bindings: {
    user: '='
  },
  controller: 'adminRolesAdministratorListItem'
});
