'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesAddController', function($q, asyncAction, adminRolesService) {
  var self = this;

  self.newAdministrators = [];
  self.add = function() {
    if (self.newAdministrators.length === 0) {
      return $q.reject();
    }

    var promotedTime = Date.now();
    var notificationMessages = _getNotificationMessages(self.newAdministrators.length);

    self.newAdministrators.forEach(function(administrator) {
      administrator.role = {
        timestamps: {
          creation: promotedTime
        }
      };
    });

    return asyncAction(notificationMessages, function() {
      return adminRolesService.addAdministrators(self.newAdministrators);
    });
  };

  function _getNotificationMessages(length) {
    var context = length > 1 ? 'administrators' : 'administrator';

    return {
      progressing: ['Adding', length, context, '...'].join(' '),
      success: ['Added', length, context].join(' '),
      failure: 'Failed to add ' + context
    };
  }
});
