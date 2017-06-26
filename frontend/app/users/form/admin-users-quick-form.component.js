'use strict';

angular.module('linagora.esn.admin')

.component('adminUsersQuickForm', {
  templateUrl: '/admin/app/users/form/admin-users-quick-form.html',
  controller: 'adminUsersQuickFormController',
  bindings: {
    domainId: '='
  }
});
