(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .constant('ADMIN_THEMES_COLOR_VARIABLES', [
      {apiVariable: 'primaryColor', displayText: 'Primary color', default: '#2196F3'},
      {apiVariable: 'secondaryColor', displayText: 'Secondary color', default: '#FFC107'},
      {apiVariable: 'bodyBgColor', displayText: 'Background color', default: '#f7f7f7'},
      {apiVariable: 'textColor', displayText: 'Text color', default: '#ffffff'}
    ]);
})(angular);
