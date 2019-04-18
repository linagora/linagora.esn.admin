(function() {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminElasticsearchSubheader', {
    templateUrl: '/admin/app/elasticsearch/admin-elasticsearch-subheader.html',
    bindings: {
      onFormSubmit: '&',
      form: '<'
    }
  });
})();
