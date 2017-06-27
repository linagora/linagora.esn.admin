(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminJamesSubheader', {
    templateUrl: '/admin/app/james/admin-james-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);
