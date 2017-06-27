(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminGeneralSubheader', {
    templateUrl: '/admin/app/general/admin-general-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);
