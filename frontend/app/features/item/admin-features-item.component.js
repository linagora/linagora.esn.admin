(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminFeaturesItem', {
      templateUrl: '/admin/app/features/item/admin-features-item.html',
      bindings: {
        feature: '='
      }
    });
})(angular);
