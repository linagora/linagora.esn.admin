(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminLoginSubheader', {
    templateUrl: '/admin/app/login/admin-login-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);
