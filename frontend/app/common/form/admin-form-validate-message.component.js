'use strict';

angular.module('linagora.esn.admin')

.component('adminFormValidateMessage', {
  templateUrl: '/admin/app/common/form/admin-form-validate-message',
  bindings: {
    options: '=',
    error: '<'
  }
});
