(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminMaintenanceElasticsearchResource', {
    templateUrl: '/admin/app/maintenance/elasticsearch/resource/admin-maintenance-elasticsearch-resource.html',
    bindings: {
      resource: '<'
    }
  });
})(angular);
