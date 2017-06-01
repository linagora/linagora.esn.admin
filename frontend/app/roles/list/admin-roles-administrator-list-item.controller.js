'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesAdministratorListItem', function($translate, asyncAction, adminRolesService, session, userUtils) {
  var self = this;

  self.isMe = session.user._id === self.user._id;
  self.displayName = userUtils.displayNameOf(self.user);

  var notificationMessages = _getNotificationMessages(self.displayName);

  self.revoke = function() {
    return asyncAction(notificationMessages, function() {
      return adminRolesService.removeAdministrator(self.user);
    });
  };

  function _getNotificationMessages(displayName) {
    return {
      progressing: $translate.instant('Revoking administration right for %s', [displayName]),
      success: $translate.instant('Revoked administration right for %s', [displayName]),
      failure: $translate.instant('Failed to revoke administration right for %s', [displayName])
    };
  }
});
