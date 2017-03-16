(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminEmptyMessage', {
    templateUrl: '/admin/app/common/empty-message/admin-empty-message',
    bindings: {
      message: '@',
      type: '@',
      icon: '@?'
    },
    controller: 'adminEmptyMessageController'
  });
})(angular);
