(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminThemesPreviewDesktop', {
      templateUrl: '/admin/app/themes/preview/desktop/admin-themes-preview-desktop.html',
      bindings: {
        colors: '<',
        logos: '<'
      }
    });

})(angular);
