(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminThemesPreview', {
      templateUrl: '/admin/app/themes/preview/admin-themes-preview.html',
      bindings: {
        colors: '<',
        logos: '<'
      }
    });

})(angular);
