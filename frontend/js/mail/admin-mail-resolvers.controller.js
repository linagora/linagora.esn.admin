'use strict';

angular.module('linagora.esn.admin')

.controller('adminMailResolversController', function(ADMIN_MAIL_AVAILABLE_RESOLVERS) {
  var self = this;

  self.ADMIN_MAIL_AVAILABLE_RESOLVERS = ADMIN_MAIL_AVAILABLE_RESOLVERS;
});
