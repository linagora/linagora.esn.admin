'use strict';

angular.module('linagora.esn.admin')

.component('adminLdapForm', {
  templateUrl: '/admin/views/ldap/admin-ldap-form',
  controller: 'adminLdapFormController',
  bindings: {
    ldapConfig: '<'
  }
});
