'use strict';

angular.module('linagora.esn.admin')

.component('adminRolesAutoComplete', {
  templateUrl: '/admin/app/roles/add/admin-roles-auto-complete.html',
  controller: 'adminRolesAutoCompleteController',
  bindings: {
    newAdministrators: '='
  }
});
