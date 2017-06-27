'use strict';

angular.module('linagora.esn.admin')

.component('adminUsersFullForm', {
  templateUrl: '/admin/app/users/form/admin-users-full-form.html',
  bindings: {
    user: '<'
  }
});
