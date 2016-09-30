'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesDisplayer', {
  templateUrl: '/admin/app/modules/admin-modules-displayer',
  bindings: {
    module: '=',
    currentHomepage: '='
  },
  controller: 'adminModulesDisplayerController'
});
