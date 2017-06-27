(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminOauthFacebook', {
    templateUrl: '/admin/app/oauth/facebook/admin-oauth-facebook.html',
    bindings: {
      config: '=',
      isEnabled: '='
    }
  });
})(angular);
