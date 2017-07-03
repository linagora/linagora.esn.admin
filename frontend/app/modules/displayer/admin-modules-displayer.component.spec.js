'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The adminModulesDisplayer component', function() {
  var $rootScope, $compile;
  var testModule, testConfig, testHomePage;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin', function() {});
    angular.module('linagora.esn.test', [])
      .run(function($templateCache) {
        $templateCache.put('test-config.html', '<ng-form name="form"><input type="text" name="test" ng-model="$ctrl.configurations.test_config.value" /></ng-form>');
      })
      .component('testConfig', {
        // must be templateUrl otherwise the inner form will not be able to
        // change the parent form's dirty state
        templateUrl: 'test-config.html',
        bindings: {
          configurations: '='
        }
      });
    module('linagora.esn.test');
  });

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  beforeEach(function() {
    testHomePage = 'testHomePage';
    testConfig = {
      name: 'test_config',
      value: 'test_value'
    };
    testModule = {
      id: 'linagora.esn.test',
      title: 'Test module',
      icon: '/test/images/test-icon.svg',
      homePage: 'test',
      config: {
        template: 'test-config',
        displayIn: {
          domain: true,
          platform: false
        },
        configurations: [testConfig]
      }
    };
  });

  function initComponent(data) {
    var scope = $rootScope.$new();

    data = data || { module: testModule, homePage: testHomePage };
    scope.module = data.module;
    scope.homePage = data.homePage;

    var element = $compile('<admin-modules-displayer module="module" current-homepage="homePage" />')(scope);

    scope.$digest();

    return element;
  }

  it('should display the module title', function() {
    var element = initComponent();

    expect(element.find('h2 > span').html()).to.equal(testModule.title);
  });

  it('should display the module icon', function() {
    var element = initComponent();

    expect(element.find('h2 > img').attr('ng-src')).to.equal(testModule.icon);
  });

  it('should make the card clickable when module has configurations', function() {
    var element = initComponent();

    expect(element.find('.card').hasClass('clickable')).to.be.true;
  });

  it('should not make the card clickable when module has no configuration', function() {
    delete testModule.config.configurations;

    var element = initComponent();

    expect(element.find('.card').hasClass('clickable')).to.be.false;
  });

  it('should collapse (hide) the configuration form by default', function() {
    var element = initComponent();

    expect(element.find('.form').hasClass('ng-hide')).to.be.true;
  });

  it('should expand (show) the configuration form on click', function() {
    var element = initComponent();

    element.find('.card').click();

    expect(element.find('.form').hasClass('ng-hide')).to.be.false;
  });

  it('should display the configuration form using the module template', function() {
    var element = initComponent();

    expect(element.find('input[name="test"]')).to.have.length(1);
  });

  describe('The home page button', function() {
    var $stateParams, adminDomainConfigService;

    beforeEach(inject(function(_$stateParams_, _adminDomainConfigService_) {
      $stateParams = _$stateParams_;
      adminDomainConfigService = _adminDomainConfigService_;
    }));

    it('should inactive when current module is not home page', function() {
      var element = initComponent();

      expect(element.find('.toolbar > span.clickable').hasClass('homeActivated')).to.be.false;
    });

    it('should active when current module is home page', function() {
      testHomePage = testModule.homePage;

      var element = initComponent();

      expect(element.find('.toolbar > span.clickable').hasClass('homeActivated')).to.be.true;
    });

    it('should set home page on click', function() {
      $stateParams.domainId = 'domainId';
      adminDomainConfigService.set = sinon.stub().returns($q.when());

      var element = initComponent();

      element.find('.toolbar > span.clickable').click();

      expect(adminDomainConfigService.set).to.have.been.calledWith($stateParams.domainId, 'homePage', testModule.homePage);
    });

    it('should not issue set home page when current module is already home page', function() {
      adminDomainConfigService.set = sinon.spy();
      testHomePage = testModule.homePage;

      var element = initComponent();

      element.find('.toolbar > span.clickable').click();

      expect(adminDomainConfigService.set).to.not.have.been.called;
    });

  });

  describe('The save button', function() {
    it('should be disabled when nothing changed', function() {
      var element = initComponent();

      expect(element.find('admin-modules-save-button button').attr('disabled')).to.equal('disabled');
    });

    it('should be enabled when form is changed', function() {
      var element = initComponent();

      element.find('input[name="test"]')
        .trigger('focus')
        .val('new value')
        .trigger('input')
        .trigger('blur');

      expect(element.find('admin-modules-save-button button').attr('disabled')).to.not.exist;
    });
  });
});
