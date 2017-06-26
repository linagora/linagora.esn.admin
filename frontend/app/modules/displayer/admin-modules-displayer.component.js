'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesDisplayer', {
  templateUrl: '/admin/app/modules/displayer/admin-modules-displayer',
  bindings: {
    module: '=',
    currentHomepage: '='
  },
  controller: 'adminModulesDisplayerController'
});
