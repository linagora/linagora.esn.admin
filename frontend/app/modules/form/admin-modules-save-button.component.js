'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesSaveButton', {
  templateUrl: '/admin/app/modules/form/admin-modules-save-button.html',
  controller: 'adminModulesSaveButtonController',
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
