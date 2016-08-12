'use strict';

angular.module('linagora.esn.admin')

.component('adminUserQuickForm', {
  templateUrl: '/admin/views/user/admin-user-quick-form',
  controller: 'adminUserQuickFormController',
  bindings: {
    domainId: '='
  }
});
