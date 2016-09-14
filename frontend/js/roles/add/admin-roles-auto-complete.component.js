'use strict';

angular.module('linagora.esn.admin')

.component('adminRolesAutoComplete', {
  templateUrl: '/admin/views/roles/add/admin-roles-auto-complete',
  controller: 'adminRolesAutoCompleteController',
  bindings: {
    newAdministrators: '='
  }
});
