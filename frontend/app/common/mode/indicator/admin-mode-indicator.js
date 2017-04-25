(function(angular) {
  angular.module('linagora.esn.admin')
    .component('adminModeIndicator', {
      templateUrl: '/admin/app/common/mode/indicator/admin-mode-indicator',
      controller: adminModeIndicatorController
    });

  function adminModeIndicatorController(adminModeService, session) {
    var self = this;

    self.$onInit = $onInit;
    self.isInPlatformMode = isInPlatformMode;
    self.goToDomainMode = goToDomainMode;

    function $onInit() {
      self.isDomainAdmin = session.userIsDomainAdministrator();
    }

    function isInPlatformMode() {
      return adminModeService.isPlatformMode();
    }

    function goToDomainMode() {
      adminModeService.goToDomainMode();
    }
  }
})(angular);
