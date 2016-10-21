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

  function initTemplate(type, required, errorMessages) {
    return '<form name="form">' +
              '<admin-form-group ' + errorMessages + ' >' +
                '<input class="form-control" ng-model="model" type="' + type + '" ' + required + ' name="name"/>' +
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
});
