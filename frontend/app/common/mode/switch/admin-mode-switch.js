(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminModeSwitch', {
      templateUrl: '/admin/app/common/mode/switch/admin-mode-switch.html',
      controller: adminmModeSwitchController
    });

  function adminmModeSwitchController(session, adminModeService) {
    var self = this;

    self.$onInit = $onInit;
    self.goToDomainMode = goToDomainMode;
    self.goToPlatformMode = goToPlatformMode;
    self.isPlatformMode = isPlatformMode;
    self.currentDomain = session.domain;

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
