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

    self.newAdministrators.forEach(function(administrator) {
      administrator.role = {
        timestamps: {
          creation: promotedTime
        }
      };
    });

    return asyncAction('Adding ' + self.newAdministrators.length + ' administrators', function() {
      return adminRolesService.addAdministrators(self.newAdministrators);
    });
  };
});
