
(function(angular) {
  'use strict';

angular.module('linagora.esn.admin')
  .component('adminWebserverSubheader', {
    templateUrl: '/admin/app/webserver/admin-webserver-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);

