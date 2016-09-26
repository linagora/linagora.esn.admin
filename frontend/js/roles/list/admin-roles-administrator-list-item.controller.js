'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesAdministratorListItem', function(asyncAction, adminRolesService, session, userUtils) {
  var self = this;

  self.isMe = session.user._id === self.user._id;
  self.displayName = userUtils.displayNameOf(self.user);

  self.revoke = function() {
    return asyncAction('Revoking administrator "' + self.displayName + '"', function() {
      return adminRolesService.removeAdministrator(self.user);
    });
  };

});
