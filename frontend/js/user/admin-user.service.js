'use strict';

angular.module('linagora.esn.admin')

.factory('adminUserService', function($rootScope, domainAPI, asyncAction, ADMIN_USER_EVENTS) {

  function createMember(domainId, user) {
    return asyncAction('Creation new user of domain', function() {
      return domainAPI.createMember(domainId, user);
    }).then(function(response) {
      $rootScope.$broadcast(ADMIN_USER_EVENTS.CREATE, response.data);
    });
  }

  return {
    createMember: createMember
  };
});
