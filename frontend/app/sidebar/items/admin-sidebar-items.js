(function(angular) {
  angular.module('linagora.esn.admin')
    .component('adminSidebarItems', {
      templateUrl: '/admin/app/sidebar/items/admin-sidebar-items.html',
      bindings: {
        items: '<'
      }
    });
})(angular);
