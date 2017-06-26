(function(angular) {

  angular.module('linagora.esn.admin')

  .component('adminJamesQuota', {
    templateUrl: '/admin/app/james/quota/admin-james-quota.html',
    bindings: {
      quota: '='
    }
  });

})(angular);
