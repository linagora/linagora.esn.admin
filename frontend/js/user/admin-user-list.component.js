'use strict';

angular.module('linagora.esn.admin')

.component('adminUserList', {
  templateUrl: '/admin/views/user/admin-user-list',
  controller: 'adminUserListController',
  bindings: {
    domainId: '='
  }
});
