'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The adminModeIndicator component', function() {
  var $rootScope, $compile, session, adminModeService;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');
  });

  beforeEach(inject(function(_$rootScope_, _$compile_, _session_, _adminModeService_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    session = _session_;
    adminModeService = _adminModeService_;
  }));

  function initComponent() {
    var scope = $rootScope.$new();
    var element = $compile('<admin-mode-indicator />')(scope);

    scope.$digest();

    return element;
  }

  it('should display when current user is in platform mode', function() {
    adminModeService.isPlatformMode = function() { return true; };

    var element = initComponent();

    expect(element.find('div').hasClass('ng-hide')).to.be.false;
  });

  it('should display when current user is not in platform mode', function() {
    adminModeService.isPlatformMode = function() { return false; };

    var element = initComponent();

    expect(element.find('div').hasClass('ng-hide')).to.be.true;
  });

  it('should allow user to switch to domain mode if possible', function() {
    adminModeService.isPlatformMode = function() { return true; };
    session.userIsDomainAdministrator = function() { return true; };

    var element = initComponent();

    expect(element.find('div a').html()).to.contain('Switch to domain mode');
  });
});
