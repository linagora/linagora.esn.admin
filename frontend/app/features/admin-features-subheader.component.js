(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminFeaturesSubheader', {
    templateUrl: '/admin/app/features/admin-features-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})(angular);
