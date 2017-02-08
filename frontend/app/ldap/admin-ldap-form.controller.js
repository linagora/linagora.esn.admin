'use strict';

angular.module('linagora.esn.admin')
.constant('ADMIN_LDAP_MAPPING', ['firstname', 'lastname', 'email', 'description', 'main_phone', 'office_location', 'building_location', 'service', 'job_title'])

.controller('adminLdapFormController', function($stateParams, ADMIN_LDAP_MAPPING) {
  var self = this;

  self.domainId = $stateParams.domainId;
  self.AVAILABLE_KEYS = ADMIN_LDAP_MAPPING;
  self.ldapConfig.configuration.mapping = self.ldapConfig.configuration.mapping || {};
  self.usernameField = usernameFieldGetter;

  self.delete = function(form) {
    self.ldapConfig.deleted = true;
    form.$setDirty();
  };

  self.undo = function() {
    self.ldapConfig.deleted = false;
  };

  function usernameFieldGetter(usernameField) {
    if (arguments.length) {
      usernameField = usernameField || '';

      self.ldapConfig.configuration.searchFilter = '(' + usernameField + '={{username}})';

      return usernameField;
    }

    return getUsernameField(self.ldapConfig.configuration.searchFilter);
  }

  function getUsernameField(ldapSearchFilter) {
    var matches = ldapSearchFilter && ldapSearchFilter.match(/\((.*)=\{\{username\}\}\)/);

    return matches ? matches[1] : null;
  }
});
