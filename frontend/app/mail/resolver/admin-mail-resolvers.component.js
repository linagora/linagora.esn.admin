'use strict';

angular.module('linagora.esn.admin')

.component('adminMailResolvers', {
  templateUrl: '/admin/app/mail/resolver/admin-mail-resolvers',
  controller: 'adminMailResolversController',
  bindings: {
    resolvers: '='
  }
});
