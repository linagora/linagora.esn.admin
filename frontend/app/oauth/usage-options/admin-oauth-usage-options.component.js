(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminOauthUsageOptions', {
    templateUrl: '/admin/app/oauth/usage-options/admin-oauth-usage-options.html',
    bindings: {
      options: '='
    }
  });
})(angular);
