'use strict';

angular.module('linagora.esn.admin')

.component('adminMailResolver', {
  templateUrl: '/admin/views/mail/admin-mail-resolver',
  controller: 'adminMailResolverController',
  bindings: {
    resolver: '=',
    metaData: '='
  }
});
