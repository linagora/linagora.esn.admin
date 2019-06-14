'use strict';

angular.module('linagora.esn.admin')

.component('adminModulesDisplayer', {
  templateUrl: '/admin/app/modules/displayer/admin-modules-displayer.html',
  bindings: {
    module: '=',
    onModuleEnabledStateChange: '&'
  },
  controller: 'adminModulesDisplayerController'
});
