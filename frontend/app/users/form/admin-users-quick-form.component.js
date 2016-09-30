'use strict';

angular.module('linagora.esn.admin')

.component('adminUsersQuickForm', {
  templateUrl: '/admin/app/users/form/admin-users-quick-form',
  controller: 'adminUsersQuickFormController',
  bindings: {
    domainId: '='
  }
});
