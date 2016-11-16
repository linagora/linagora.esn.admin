'use strict';

angular.module('linagora.esn.admin')
.constant('ADMIN_LDAP_MAPPING', ['firstname', 'lastname', 'email', 'description', 'main_phone', 'office_location', 'building_location', 'service', 'job_title'])

.controller('adminLdapFormController', function(_, ADMIN_LDAP_MAPPING) {
  var self = this;

  self.AVAILABLE_KEYS = ADMIN_LDAP_MAPPING;

  self.delete = function(form) {
    self.ldapConfig.deleted = true;
    form.$setDirty();
  };

  self.undo = function() {
    self.ldapConfig.deleted = false;
  };
});
