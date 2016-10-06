'use strict';

angular.module('linagora.esn.admin')

.directive('adminFormValidator', function($compile) {
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attrs) {
      var AVAILABLE_ERRORS = ['min', 'max', 'minlength', 'maxlength', 'pattern', 'email', 'required', 'url', 'date', 'datetimelocal', 'time', 'week', 'month'];

      scope.options = {};
      scope.elementForm = scope.form[attrs.name];

      angular.forEach(AVAILABLE_ERRORS, function(error) {
        var custom_error = error + 'ErrorMessage';

        scope.options[error] = {
          value: attrs[error],
          message: {
            error: attrs[custom_error]
          }
        };
      });

      var template = '<admin-form-validate-message ng-if="form.$invalid && !elementForm.$pristine" options="options" error="elementForm.$error" />';
      var validateMessage = $compile(template)(scope);

      element.parent().after(validateMessage);
    }
  };
});
