'use strict';

angular.module('linagora.esn.admin')

.component('adminUsersCreateSubheader', {
  templateUrl: '/admin/app/users/create/admin-users-create-subheader',
  bindings: {
    onSaveButtonClick: '&',
    disableSaveButton: '<'
  }
});
