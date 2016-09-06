'use strict';

angular.module('linagora.esn.admin')

.controller('adminMailResolversController', function(ADMIN_MAIL_AVAILABLE_RESOLVERS) {
  var self = this;

  self.ADMIN_MAIL_AVAILABLE_RESOLVERS = ADMIN_MAIL_AVAILABLE_RESOLVERS;

  ADMIN_MAIL_AVAILABLE_RESOLVERS.forEach(function(resolverMetaData) {
    var resolver = self.resolvers[resolverMetaData.key];

    if (!resolver) {
      resolver = { active: false };
      self.resolvers[resolverMetaData.key] = resolver;
    }

    if (resolverMetaData.hasOptions) {
      resolver.options = resolver.options || {};
    }
  });
});
