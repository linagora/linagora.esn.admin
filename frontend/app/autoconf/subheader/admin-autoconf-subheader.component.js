(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminAutoconfSubheader', {
    templateUrl: '/admin/app/autoconf/subheader/admin-autoconf-subheader',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);
