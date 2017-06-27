(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminOauthGithub', {
    templateUrl: '/admin/app/oauth/github/admin-oauth-github.html',
    bindings: {
      config: '=',
      isEnabled: '='
    }
  });
})(angular);
