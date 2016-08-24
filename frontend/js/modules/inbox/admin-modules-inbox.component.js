'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesInbox', {
  templateUrl: '/admin/views/modules/inbox/admin-modules-inbox',
  controller: 'adminModulesInboxController',
  bindings:  {
    features: '='
  }
});
