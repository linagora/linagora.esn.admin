'use strict';

angular.module('linagora.esn.admin')

.component('adminFormValidateMessage', {
  templateUrl: '/admin/views/validate/admin-form-validate-message',
  bindings: {
    options: '=',
    error: '<'
  }
});
