'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The adminFormValidator directive', function() {
  var $rootScope, $compile;
  var scope;
  var templateMock;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');

    inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    });

    templateMock = '<form name="form"><div class="form-group"><input ng-model="model.email" type="email" admin-form-validator name="email" /></div></form>';
  });

  function initDirective() {
    scope = $rootScope.$new();

    var element = $compile(templateMock)(scope);

    scope.$digest();

    return element;
  }

  it('should be show nothing when form valid', function() {
    var element = initDirective();
    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(scope.form.email.$error).to.deep.equal({});
    expect(validatorMessageElement.text()).to.equal('');
  });

  it('should be show default message error when given invalid email', function() {
    var element = initDirective();

    scope.form.email.$setViewValue('invalidMail');
    scope.$digest();

    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(scope.form.email.$error.email).to.be.true;
    expect(validatorMessageElement.text()).to.equal('Invalid email');
  });

  it('should be show custom message error when given invalid email', function() {
    var emailErrorMessage = 'Custom email error';

    templateMock = '<form name="form"><div class="form-group"><input ng-model="model.email" type="email" admin-form-validator name="email", email-error-message="' + emailErrorMessage + '" /></div></form>';
    var element = initDirective();

    scope.form.email.$setViewValue('invalidMail');
    scope.$digest();

    var validatorMessageElement = angular.element(element[0].querySelector('admin-form-validate-message'));

    expect(scope.form.email.$error.email).to.be.true;
    expect(validatorMessageElement.text()).to.equal(emailErrorMessage);
  });
});
