(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminOauthFacebook', {
    templateUrl: '/admin/app/oauth/facebook/admin-oauth-facebook',
    bindings: {
      config: '=',
      isEnabled: '='
    }
  });
})(angular);
