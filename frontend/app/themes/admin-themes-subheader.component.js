(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

    .component('adminThemesSubheader', {
      templateUrl: '/admin/app/themes/admin-themes-subheader.html',
      bindings: {
        onFormSubmit: '&',
        form: '<'
      }
    });
})(angular);
