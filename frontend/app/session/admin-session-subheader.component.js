(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminSessionSubheader', {
    templateUrl: '/admin/app/session/admin-session-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);
