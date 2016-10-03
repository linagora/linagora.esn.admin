'use strict';

angular.module('linagora.esn.admin')

.component('adminLdapForm', {
  templateUrl: '/admin/app/ldap/admin-ldap-form',
  controller: 'adminLdapFormController',
  bindings: {
    ldapConfig: '<'
  }
});
