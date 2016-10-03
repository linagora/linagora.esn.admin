'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesSubheader', {
  templateUrl: '/admin/app/modules/admin-modules-subheader',
  bindings: {
    onSaveButtonClick: '&',
    disableSaveButton: '<'
  }
});
