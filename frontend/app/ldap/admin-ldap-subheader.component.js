'use strict';

angular.module('linagora.esn.admin')

.component('adminLdapSubheader', {
  templateUrl: '/admin/app/ldap/admin-ldap-subheader.html',
  bindings: {
    onFormSubmit: '&',
    form: '<'
  }
});
