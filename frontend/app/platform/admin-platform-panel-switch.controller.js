(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .controller('adminPlatformPanelSwitchController', adminPlatformPanelSwitchController);

  function adminPlatformPanelSwitchController($scope, $state, session) {
    var self = this;

    self.isInPlatformPage = isInPlatformPage;
    self.isAdmin = session.user.isPlatformAdmin && session.userIsDomainAdministrator();
    self.nextState = (isInPlatformPage()) ? ' Domain' : ' Platform';
    self.transition = transition;

    function transition() {
      if (isInPlatformPage()) {
        self.nextState = ' Platform';

        return $state.go('admin.domain', { domainId: session.domain._id });
      }
      self.nextState = ' Domain';

      return $state.go('admin.platform');
    }

    function isInPlatformPage() {
      return $state.is('admin.platform');
    }
  }
})(angular);
