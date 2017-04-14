(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .component('adminSidebar', {
      templateUrl: '/admin/app/sidebar/admin-sidebar',
      controller: adminSidebarController
    });

    function adminSidebarController($scope, adminModeService, ADMIN_PAGES) {
      var self = this;

      self.$onInit = $onInit;

      function $onInit() {
        self.availablePages = getAvailablePages();

        $scope.$watch(function() {
          return adminModeService.isPlatformMode();
        }, function() {
          self.availablePages = getAvailablePages();
        });
      }

      function getAvailablePages() {
        var displayIn = adminModeService.isPlatformMode() ? 'platform' : 'domain';

        return ADMIN_PAGES.filter(function(page) {
          return page.displayIn[displayIn];
        });
      }
    }
})(angular);
