(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminMaintenanceItem', {
      templateUrl: '/admin/app/maintenance/maintenance-item/admin-maintenance-item.html',
      bindings: {
        action: '='
      }
    });
})(angular);
