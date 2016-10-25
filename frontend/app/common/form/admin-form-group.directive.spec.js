'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The adminFormGroup directive', function() {
  var $rootScope, $compile;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');

    inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    });
  });

  function initTemplate(type, required, errorMessages, expression) {
    expression = expression || '';

    return '<form name="form">' +
              '<admin-form-group ' + errorMessages + ' >' +
                '<input class="form-control" ng-model="model" type="' + type + '" ' + required + ' name="name" ' + expression + ' />' +
              '</admin-form-group>' +
           '</form>';
  }

  function initDirective(scope, template) {
    scope = scope || $rootScope.$new();

    var element = $compile(template)(scope);

    scope.$digest();

    return element;
  }

  it('should be show nothing when form valid', function() {
    var template = initTemplate('text', null, null);
    var element = initDirective(null, template);

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('');
  });

  it('should be show default message error when given invalid value', function() {
    var template = initTemplate('email', null, null);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.val('invalid-email').trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('Invalid email');
  });

  it('should be show custom message error when given invalid value', function() {
    var emailErrorMessage = 'This must be email format';
    var errorMessages = 'email-error-message="' + emailErrorMessage + '"';

    var template = initTemplate('email', null, errorMessages);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.val('invalid-email').trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal(emailErrorMessage);
  });

  it('should be show default message error when given invalid expression maxlength', function() {
    var expression = 'maxlength=6';
    var template = initTemplate('text', null, null, expression);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.val('invalidmaxlength').trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('Length must be less than or equal to 6');
  });

  it('should be show default message error when given invalid expression minlength', function() {
    var expression = 'minlength=5';
    var template = initTemplate('text', null, null, expression);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.val('abc').trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('Length must be greater than or equal to 5');
  });

  it('should be show default message error when given invalid expression max', function() {
    var expression = 'max=30';
    var template = initTemplate('number', null, null, expression);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.val('31').trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('This must be less than or equal to 30');
  });

  it('should be show default message error when given invalid expression min', function() {
    var expression = 'min=30';
    var template = initTemplate('number', null, null, expression);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.val('29').trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('This must be greater than or equal to 30');
  });

  it('should add class has-required for admin-form-group when input is required', function() {
    var template = initTemplate('email', 'required', null);
    var element = initDirective(null, template);

    var adminFormGroupEle = angular.element(element[0].querySelector('admin-form-group'));

    expect(adminFormGroupEle.hasClass('has-required')).to.be.true;
  });

  it('should add class has-invalid for admin-form-group when input has blur event and invalid', function() {
    var template = initTemplate('email', 'required', null);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.triggerHandler('focus');
    formControlEle.val('invalid-email').trigger('input');
    formControlEle.triggerHandler('blur');

    var adminFormGroupEle = angular.element(element[0].querySelector('admin-form-group'));

    expect(adminFormGroupEle.hasClass('has-invalid')).to.be.true;
  });

  it('should not add class has-invalid for admin-form-group when input has blur event and valid', function() {
    var template = initTemplate('email', 'required', null);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.triggerHandler('focus');
    formControlEle.val('valid@linagora.com').trigger('input');
    formControlEle.triggerHandler('blur');

    var adminFormGroupEle = angular.element(element[0].querySelector('admin-form-group'));

    expect(adminFormGroupEle.hasClass('has-invalid')).to.be.false;
  });

  it('should add class has-focus for admin-form-group when input is focused', function() {
    var template = initTemplate('email', 'required', null);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.triggerHandler('focus');

    var adminFormGroupEle = angular.element(element[0].querySelector('admin-form-group'));

    expect(adminFormGroupEle.hasClass('has-focus')).to.be.true;
  });

  it('should remove class has-focus for admin-form-group when input has blur event', function() {
    var template = initTemplate('email', 'required', null);
    var element = initDirective(null, template);
    var formControlEle = angular.element(element[0].querySelector('.form-control'));

    formControlEle.triggerHandler('blur');

    var adminFormGroupEle = angular.element(element[0].querySelector('admin-form-group'));

    expect(adminFormGroupEle.hasClass('has-focus')).to.be.false;
  });

  it('should throw exception when form controller is missing', function() {
    var template = '<form>' +
                      '<admin-form-group>' +
                        '<input class="form-control" ng-model="model" type="text" />' +
                      '</admin-form-group>' +
                   '</form>';

    function errorFunctionWrapper() {
      initDirective(null, template);
    }

    expect(errorFunctionWrapper).to.throw();
  });

  it('should support custom form\'s name', function() {
    var template = '<form name="customForm">' +
                      '<admin-form-group form="customForm">' +
                        '<input class="form-control" ng-model="model" type="text" />' +
                      '</admin-form-group>' +
                   '</form>';

    var element = initDirective(null, template);

    var validatorMessageElement = angular.element(element[0].querySelectorAll('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('');
  });
});
