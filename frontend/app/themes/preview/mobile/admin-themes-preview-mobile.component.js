(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminThemesPreviewMobile', {
      templateUrl: '/admin/app/themes/preview/mobile/admin-themes-preview-mobile.html',
      bindings: {
        colors: '<',
        logos: '<'
      }
    });

})(angular);
