'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesSubheader', {
  templateUrl: '/admin/views/modules/admin-modules-subheader',
  bindings: {
    onSaveButtonClick: '&',
    disableSaveButton: '<'
  }
});
