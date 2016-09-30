'use strict';

angular.module('linagora.esn.admin')

.component('adminMailResolver', {
  templateUrl: '/admin/app/mail/resolver/admin-mail-resolver',
  controller: 'adminMailResolverController',
  bindings: {
    resolver: '=',
    metaData: '='
  }
});
