'use strict';

angular.module('linagora.esn.admin')

.directive('adminModulesForm', function($compile) {
  function link(scope, element) {
    var template = '<' + scope.template + ' configurations="configurations" />';

    element.append($compile(template)(scope));
  }

  return {
    restrict: 'E',
    template: '',
    scope: {
      configurations: '=',
      template: '='
    },
    link: link
  };
});
