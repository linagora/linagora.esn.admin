'use strict';

angular.module('linagora.esn.admin')

.directive('adminFormGroup', function($compile) {
  function link(scope, element, attrs) {
    var AVAILABLE_ERRORS = ['min', 'max', 'minlength', 'maxlength', 'pattern', 'email', 'required', 'url', 'date', 'datetimelocal', 'time', 'week', 'month'];
    var fgLineEle = element.find('.fg-line');
    var formControlEle = element.find('.form-control');
    var formController = scope[attrs.form];

    scope.options = {};

    if (!formController) {
      if (scope.form) {
        formController = scope.form;
      } else {
        throw new Error('no form is specified and form is missing in scope');
      }
    }

    if (formControlEle.attr('required')) {
      element.addClass('has-required');
    }

    scope.label = attrs.label;

    //  use default css of .fg-line
    // .fg-line:not([class*=has-]):after {
    //    background: #2196F3;
    //  }
    fgLineEle.addClass('has-underline');

    formControlEle.bind('focus', function() {
      fgLineEle.removeClass('has-underline');
      element.addClass('has-focus');
    });

    formControlEle.bind('blur', function() {
      fgLineEle.addClass('has-underline');
      element.removeClass('has-focus');

      if (formControlEle.hasClass('ng-invalid')) {
        element.addClass('has-invalid');
      } else {
        element.removeClass('has-invalid');
      }
    });

    scope.elementForm = formController[formControlEle.attr('name')];

    _getErrorMessage();
    _updateErrorValue(_getFormControlValidateAttrs());

    scope.$watch(_getFormControlValidateAttrs, function(newAttrs, oldAttrs) {
      if (!angular.equals(newAttrs, oldAttrs)) {
        _updateErrorValue(newAttrs);
      }
    }, true);

    var template = '<div class="admin-form-validate-message-container"><admin-form-validate-message ng-class="elementForm.$pristine && !elementForm.$touched ? \'pristine\' : \'dirty\'" ng-if="elementForm.$error" options="options" error="elementForm.$error" /><div>';
    var validateMessage = $compile(template)(scope);

    element.find('.form-group').append(validateMessage);

    function _getFormControlValidateAttrs() {
      var formControlAttrs = element.find('.form-control')[0].attributes;
      var attributes = {};

      angular.forEach(AVAILABLE_ERRORS, function(error) {
        if (formControlAttrs[error]) {
          attributes[error] = formControlAttrs[error].value;
        }
      });

      return attributes;
    }

    function _getErrorMessage() {
      angular.forEach(AVAILABLE_ERRORS, function(error) {
        var custom_error = error + 'ErrorMessage';

        scope.options[error] = {
          message: {
            error: attrs[custom_error]
          }
        };
      });
    }

    function _updateErrorValue(attibutes) {
      angular.forEach(attibutes, function(value, key) {
        scope.options[key].value = value;
      });
    }
  }

  return {
    restrict: 'E',
    templateUrl: '/admin/app/common/form/admin-form-group',
    transclude: true,
    scope: true,
    link: link
  };
});
