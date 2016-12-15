'use strict';

angular.module('linagora.esn.admin')

.component('adminLdapTest', {
  templateUrl: '/admin/app/ldap/test/admin-ldap-test',
  controller: 'adminLdapTestController',
  bindings: {
    domainId: '=',
    config: '<'
  }
});
