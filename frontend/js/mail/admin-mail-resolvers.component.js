'use strict';

angular.module('linagora.esn.admin')

.component('adminMailResolvers', {
  templateUrl: '/admin/views/mail/admin-mail-resolvers',
  controller: 'adminMailResolversController',
  bindings: {
    resolvers: '='
  }
});
