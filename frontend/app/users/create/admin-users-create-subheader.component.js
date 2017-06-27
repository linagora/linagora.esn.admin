'use strict';

angular.module('linagora.esn.admin')

.component('adminUsersCreateSubheader', {
  templateUrl: '/admin/app/users/create/admin-users-create-subheader.html',
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
