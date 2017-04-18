(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminOauthTwitter', {
    templateUrl: '/admin/app/oauth/twitter/admin-oauth-twitter',
    bindings: {
      config: '='
    }
  });
})(angular);
