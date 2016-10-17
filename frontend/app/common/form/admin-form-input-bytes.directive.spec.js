'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The adminFormInputBytes directive', function() {
  var $rootScope, $compile;
  var minErrorMessage, maxErrorMessage;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');

    inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    });
  });

  function initTemplate(inputValue, inputUnit, min, max) {
    minErrorMessage = 'This must be greater than or equal to ' + min;
    maxErrorMessage = 'This must be less than or equal to ' + max;

    return '<admin-form-input-bytes input-value="' + inputValue + '", input-unit="' + inputUnit + '", min="' + min + '", max="' + max + '" />';
  }

  function initDirective(scope, template) {
    scope = scope || $rootScope.$new();

    var element = $compile(template)(scope);

    scope.$digest();

    return element;
  }

  it('should optimize avalable units when max value is less than 1024', function() {
    var max = '2MB';
    var template = initTemplate(null, null, null, max);
    var expectAvailableUnits = ['BYTES', 'KB', 'MB'];

    var element = initDirective(null, template);
    var unitsElement = angular.element(element[0].querySelectorAll('.dropdown-menu a'));
    var availableUnits = [];

    for (var i = 0; i < unitsElement.length; i++) {
      availableUnits.push(unitsElement[i].innerText);
    }

    expect(availableUnits).to.deep.equal(expectAvailableUnits);
  });

  it('should optimize avalable units when max value is greater than 1024', function() {
    var max = '1025MB';
    var template = initTemplate(null, null, null, max);

    var expectAvailableUnits = ['BYTES', 'KB', 'MB', 'GB'];
    var element = initDirective(null, template);
    var unitsElement = angular.element(element[0].querySelectorAll('.dropdown-menu a'));
    var availableUnits = [];

    for (var i = 0; i < unitsElement.length; i++) {
      availableUnits.push(unitsElement[i].innerText);
    }

    expect(availableUnits).to.deep.equal(expectAvailableUnits);
  });

  it('should return correct display value of unit if input value is odd of 1024', function() {
    var inputValue = 1025;
    var inputUnit = 'BYTES';
    var template = initTemplate(inputValue, inputUnit, null, null);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));
    var dropdownButtonElement = angular.element(element[0].querySelector('button.dropdown-toggle'));

    expect(unitInputElement.val()).to.equal('1025');
    expect(dropdownButtonElement.text()).to.equal('BYTES');
  });

  it('should return correct display value of unit if input value is even of 1024', function() {
    var inputValue = 1024;
    var inputUnit = 'BYTES';
    var template = initTemplate(inputValue, inputUnit, null, null);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));
    var dropdownButtonElement = angular.element(element[0].querySelector('button.dropdown-toggle'));

    expect(unitInputElement.val()).to.equal('1');
    expect(dropdownButtonElement.text()).to.equal('KB');
  });

  it('should return correct min/max if min/max value is float', function() {
    var inputValue = 1025;
    var inputUnit = 'BYTES';
    var min = '1.5KB';
    var max = '50.5KB';
    var template = initTemplate(inputValue, inputUnit, min, max);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));
    var expectMin = 1.5 * Math.pow(2, 10);
    var expectMax = 50.5 * Math.pow(2, 10);

    expect(unitInputElement.attr('min')).to.equal(expectMin.toString());
    expect(unitInputElement.attr('max')).to.equal(expectMax.toString());
  });

  it('should change input value to undefined when input after trigger is invalid', function() {
    var inputValue = 1024;
    var inputUnit = 'BYTES';
    var max = '50KB';
    var template = initTemplate(inputValue, inputUnit, null, max);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));

    unitInputElement.val(60).trigger('input');

    expect(element.isolateScope().inputValue).to.be.undefined;
  });

  it('should change input value when input after trigger is valid', function() {
    var inputValue = 1024;
    var inputUnit = 'BYTES';
    var max = '50KB';
    var template = initTemplate(inputValue, inputUnit, null, max);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));

    unitInputElement.val(20).trigger('input');

    expect(element.isolateScope().inputValue).to.equal(20 * Math.pow(2, 10));
  });

  it('should change input value to undefined when change unit and form is invalid', function() {
    var inputValue = 25;
    var inputUnit = 'KB';
    var min = '1KB';
    var template = initTemplate(inputValue, inputUnit, min, null);

    var element = initDirective(null, template);
    var unitsElement = angular.element(element[0].querySelectorAll('.dropdown-menu a'));

    unitsElement[0].click();

    expect(element.isolateScope().inputValue).to.be.undefined;
  });

  it('should change input value when change unit and form is valid', function() {
    var inputValue = 25;
    var inputUnit = 'BYTES';
    var min = '1KB';
    var template = initTemplate(inputValue, inputUnit, min, null);

    var element = initDirective(null, template);
    var unitsElement = angular.element(element[0].querySelectorAll('.dropdown-menu a'));

    unitsElement[1].click();

    expect(element.isolateScope().inputValue).to.equal(25 * Math.pow(2, 10));
  });

  it('should show error message when user has not interacted with the input yet but unit is changed', function() {
    var inputValue = 0;
    var min = '1KB';
    var template = initTemplate(inputValue, null, min, null);

    var element = initDirective(null, template);
    var unitBytesElement = angular.element(element[0].querySelectorAll('.dropdown-menu a'))[0];

    unitBytesElement.click();

    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal(minErrorMessage);
  });

  it('should show error message when input has invalid min', function() {
    var min = '1KB';
    var template = initTemplate(null, null, min, null);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));

    unitInputElement.val(0).trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal(minErrorMessage);
  });

  it('should show error message when input has invalid max', function() {
    var max = '50BYTES';
    var template = initTemplate(null, null, null, max);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));

    unitInputElement.val(60).trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal(maxErrorMessage);
  });

  it('should hide error message when value from invalid to valid by change input', function() {
    var max = '50BYTES';
    var template = initTemplate(null, null, null, max);

    var element = initDirective(null, template);
    var unitInputElement = angular.element(element[0].querySelector('input[name=dataSizeInput]'));

    unitInputElement.val(60).trigger('input');

    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal(maxErrorMessage);

    unitInputElement.val(40).trigger('input');
    validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('');
  });

  it('should hide error message when value from invalid to valid by change unit', function() {
    var inputValue = 25;
    var inputUnit = 'KB';
    var min = '1KB';
    var template = initTemplate(inputValue, inputUnit, min, null);

    var element = initDirective(null, template);
    var unitsElement = angular.element(element[0].querySelectorAll('.dropdown-menu a'));

    unitsElement[0].click();

    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal(minErrorMessage);

    unitsElement[1].click();
    validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(validatorMessageElement.text()).to.equal('');
  });
});
