'use strict';

angular.module('linagora.esn.admin')

.component('adminMailResolver', {
  templateUrl: '/admin/app/mail/resolver/admin-mail-resolver.html',
  controller: 'adminMailResolverController',
  bindings: {
    resolver: '=',
    metaData: '='
  }
});
