(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminOauthSubheader', {
    templateUrl: '/admin/app/oauth/admin-oauth-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);
