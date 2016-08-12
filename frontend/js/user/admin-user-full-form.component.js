'use strict';

angular.module('linagora.esn.admin')

.component('adminUserFullForm', {
  templateUrl: '/admin/views/user/admin-user-full-form',
  bindings: {
    user: '<'
  }
});
