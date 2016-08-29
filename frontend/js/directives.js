'use strict';

angular.module('linagora.esn.admin')

.directive('adminApplicationMenu', function(applicationMenuTemplateBuilder) {
  return {
    restrict: 'E',
    replace: true,
    template: applicationMenuTemplateBuilder('/#/admin', 'mdi-server-security', 'Administration')
  };
})

.directive('adminFormValidator', function($compile) {
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {
      var expressionAttrs = ['type', 'min', 'max', 'minlength', 'maxlength'];
      scope.options = {};
      angular.forEach(expressionAttrs, function(item) {
        scope.options[item] = attrs[item];
      });
      scope.elementForm = scope.form[attrs.name];

      var template = '<admin-form-validate-message ng-show="form.$invalid && !form.$pristine" options="options" error="elementForm.$error" />';
      var validateMessage = $compile(template)(scope);
      element.parent().after(validateMessage);
    }
  };
});
