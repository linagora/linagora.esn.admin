'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesInbox', {
  templateUrl: '/admin/app/modules/form/admin-modules-inbox.html',
  bindings: {
    configurations: '=',
    submit: '&',
    cancel: '&'
  }
});
