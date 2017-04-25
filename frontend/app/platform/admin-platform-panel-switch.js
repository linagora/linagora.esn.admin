(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminPlatformPanelSwitch', {
      templateUrl: '/admin/app/platform/admin-platform-panel-switch',
      controller: adminPlatformPanelSwitchController
    });

  function adminPlatformPanelSwitchController(session, adminModeService) {
    var self = this;

    self.$onInit = $onInit;
    self.goToDomainMode = goToDomainMode;
    self.goToPlatformMode = goToPlatformMode;
    self.isPlatformMode = isPlatformMode;

    function $onInit() {
      self.hasTwoAdminRoles = session.user.isPlatformAdmin && session.userIsDomainAdministrator();
    }

    function goToDomainMode() {
      return adminModeService.goToDomainMode();
    }

    function goToPlatformMode() {
      return adminModeService.goToPlatformMode();
    }

    function isPlatformMode() {
      return adminModeService.isPlatformMode();
    }
  }
})(angular);
