(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminMaintenanceController', adminMaintenanceController);

  function adminMaintenanceController(adminMaintenanceService) {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      self.maintenanceModules = adminMaintenanceService.getMaintenanceModules();
    }
  }
})(angular);
