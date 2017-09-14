'use strict';

describe('The adminMaintenanceService', function() {

  var $rootScope, $httpBackend;
  var adminMaintenanceService;

  beforeEach(module('linagora.esn.admin'));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _adminMaintenanceService_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    adminMaintenanceService = _adminMaintenanceService_;
  }));

  describe('The reindexUsers function', function() {

    it('should send POST request to the right endpoint', function(done) {
      $httpBackend.expectPOST('/admin/api/maintenance/elasticsearch?action=reindex&resource_type=users').respond(202);

      adminMaintenanceService.reindexUsers().then(done.bind(null, null), done.bind(null, 'should resolve'));

      $rootScope.$digest();

      $httpBackend.flush();
    });
  });

  describe('The reconfigureUsersIndex function', function() {

    it('should send POST request to the right endpoint', function(done) {
      $httpBackend.expectPOST('/admin/api/maintenance/elasticsearch?action=reconfigure&resource_type=users').respond(202);

      adminMaintenanceService.reconfigureUsersIndex().then(done.bind(null, null), done.bind(null, 'should resolve'));

      $rootScope.$digest();

      $httpBackend.flush();
    });
  });
});
