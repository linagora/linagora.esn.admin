'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminMaintenance component', function() {
  var $rootScope, $compile;
  var adminMaintenanceService;

  beforeEach(function() {
    module('jadeTemplates');
    module('linagora.esn.admin');
  });

  beforeEach(inject(function(_$rootScope_, _$compile_, _adminMaintenanceService_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    adminMaintenanceService = _adminMaintenanceService_;
  }));

  function initComponent() {
    var scope = $rootScope.$new();
    var element = $compile('<admin-maintenance />')(scope);

    scope.$digest();

    return element;
  }

  it('should call adminMaintenanceService.reindexUsers function when click "Reindex" button', function() {
    adminMaintenanceService.reindexUsers = sinon.spy();
    var element = initComponent();

    element.find('button')[1].click();

    $rootScope.$digest();

    expect(adminMaintenanceService.reindexUsers).to.have.been.calledOnce;
  });

  it('should call adminMaintenanceService.reconfigureUsersIndex function when click "Reconfigure" button', function() {
    adminMaintenanceService.reconfigureUsersIndex = sinon.spy();
    var element = initComponent();

    element.find('button')[2].click();

    $rootScope.$digest();

    expect(adminMaintenanceService.reconfigureUsersIndex).to.have.been.calledOnce;
  });
});
