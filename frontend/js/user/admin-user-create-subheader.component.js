'use strict';

angular.module('linagora.esn.admin')

.component('adminUserCreateSubheader', {
  templateUrl: '/admin/views/user/admin-user-create-subheader',
  bindings: {
    onSaveButtonClick: '&',
    disableSaveButton: '<'
  }
});
