(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminPlatformPanelSwitch', {
      templateUrl: '/admin/app/platform/admin-platform-panel-switch',
      controller: adminPlatformPanelSwitchController
    });

  function adminPlatformPanelSwitchController($scope, $state, session, adminModeService) {
    var self = this;

    self.$onInit = $onInit;
    self.goToDomainMode = goToDomainMode;
    self.goToPlatformMode = goToPlatformMode;

    function $onInit() {
      self.hasTwoAdminRoles = session.user.isPlatformAdmin && session.userIsDomainAdministrator();
      self.isPlatformMode = adminModeService.isPlatformMode();
    }

    function goToDomainMode() {
      self.isPlatformMode = false;

      return adminModeService.goToDomainMode();
    }

    function goToPlatformMode() {
      self.isPlatformMode = true;

      return adminModeService.goToPlatformMode();
    }
  }
})(angular);
