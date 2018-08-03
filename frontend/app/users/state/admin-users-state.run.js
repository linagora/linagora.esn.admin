(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .run(function(dynamicDirectiveService) {
      var usersStateDirective = new dynamicDirectiveService.DynamicDirective(true, 'admin-users-state', {
        attributes: [
          { name: 'user', value: 'member' }
        ]
      });

      dynamicDirectiveService.addInjection('admin-user-list-menu-items', usersStateDirective);
    });
})(angular);
