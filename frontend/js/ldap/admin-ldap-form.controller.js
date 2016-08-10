'use strict';

angular.module('linagora.esn.admin')

.controller('adminLdapFormController', function() {
  var self = this;

  self.delete = function() {
    self.ldapConfig.deleted = true;
  };

  self.undo = function() {
    self.ldapConfig.deleted = false;
  };
});
