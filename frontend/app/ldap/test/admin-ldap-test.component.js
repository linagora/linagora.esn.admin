'use strict';

angular.module('linagora.esn.admin')

.component('adminLdapTest', {
  templateUrl: '/admin/app/ldap/test/admin-ldap-test.html',
  controller: 'adminLdapTestController',
  bindings: {
    domainId: '=',
    config: '<',
    disabled: '<'
  }
});
