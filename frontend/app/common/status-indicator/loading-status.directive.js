(function() {
  'use strict';

  angular.module('linagora.esn.admin')

    .directive('adminLoadingStatus', adminStatusIndicator);

  function adminStatusIndicator() {
    return {
      restrict: 'AE',
      templateUrl: '/admin/app/common/status-indicator/loading-status.html',
      transclude: true
    };
  }
})();

