(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminOauthGoogle', {
    templateUrl: '/admin/app/oauth/google/admin-oauth-google.html',
    bindings: {
      config: '=',
      isEnabled: '='
    }
  });
})(angular);
