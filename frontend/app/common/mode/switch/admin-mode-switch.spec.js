'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModeSwitch component', function() {
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

    session.userIsDomainAdministrator = function() { return true; };
    session.user = { isPlatformAdmin: true };
  }));

  function initComponent() {
    var scope = $rootScope.$new();
    var element = $compile('<admin-mode-switch />')(scope);

    scope.$digest();

    return element;
  }

  it('should display when current user has two admin roles', function() {
    var element = initComponent();

    expect(element.find('.actions')).to.have.length(1);
  });

  it('should not display when current user is only domain admin', function() {
    session.user = { isPlatformAdmin: false };

    var element = initComponent();

    expect(element.find('.actions')).to.have.length(0);
  });

  it('should not display when current user is only platform admin', function() {
    session.userIsDomainAdministrator = function() { return false; };

    var element = initComponent();

    expect(element.find('.actions')).to.have.length(0);
  });

  it('should allow user to switch between modes', function() {
    adminModeService.isPlatformMode = function() { return true; };
    adminModeService.goToPlatformMode = sinon.spy();
    adminModeService.goToDomainMode = sinon.spy();

    var element = initComponent();

    expect(element.find('li>a span').html()).to.contain('Switch to domain mode');
    element.find('li>a span').click();
    expect(adminModeService.goToDomainMode).to.have.been.calledOnce;

    adminModeService.isPlatformMode = function() { return false; };
    element.scope().$digest();

    expect(element.find('li>a span').html()).to.contain('Switch to platform mode');
    element.find('li>a span').click();
    expect(adminModeService.goToPlatformMode).to.have.been.calledOnce;
  });

});
