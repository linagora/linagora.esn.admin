(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminGeneralLogin', {
    templateUrl: '/admin/app/general/login/admin-general-login',
    bindings: {
      login: '='
    }
  });
})(angular);
