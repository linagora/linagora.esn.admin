'use strict';

angular.module('linagora.esn.admin')

.factory('adminUsersService', function($rootScope, domainAPI, asyncAction, ADMIN_USERS_EVENTS) {

  function createMember(domainId, user) {
    var notificationMessages = {
      progressing: 'Creating user...',
      success: 'User created',
      failure: 'Failed to create user'
    };

    return asyncAction(notificationMessages, function() {
      return domainAPI.createMember(domainId, user);
    }).then(function(response) {
      $rootScope.$broadcast(ADMIN_USERS_EVENTS.CREATE, response.data);
    });
  }

  return {
    createMember: createMember
  };
});
