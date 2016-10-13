'use strict';

angular.module('linagora.esn.admin')

.controller('adminLdapFormController', function() {
  var self = this;

  self.delete = function(form) {
    self.ldapConfig.deleted = true;
    form.$setDirty();
  };

  self.undo = function() {
    self.ldapConfig.deleted = false;
  };
});
