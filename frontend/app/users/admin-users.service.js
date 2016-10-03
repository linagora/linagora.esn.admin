'use strict';

angular.module('linagora.esn.admin')

.factory('adminUsersService', function($rootScope, domainAPI, asyncAction, ADMIN_USERS_EVENTS) {

  function createMember(domainId, user) {
    return asyncAction('Creation new user of domain', function() {
      return domainAPI.createMember(domainId, user);
    }).then(function(response) {
      $rootScope.$broadcast(ADMIN_USERS_EVENTS.CREATE, response.data);
    });
  }

  return {
    createMember: createMember
  };
});
