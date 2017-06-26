'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminConfigApi Angular service', function() {

  var $rootScope, $httpBackend, esnConfigApi;
  var adminConfigApi, ADMIN_MODE;

  beforeEach(module('linagora.esn.admin'));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _esnConfigApi_, _adminConfigApi_, _Restangular_, _ADMIN_MODE_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    esnConfigApi = _esnConfigApi_;
    adminConfigApi = _adminConfigApi_;
    ADMIN_MODE = _ADMIN_MODE_;
  }));

  describe('The get fn', function() {

    it('should call esnConfigApi to get domain configurations', function(done) {
      var domainId = 'domain123';
      var query = [{ name: 'a module name', keys: ['a config key'] }];
      var responseData = 'some_data';

      esnConfigApi.getDomainConfigurations = sinon.stub().returns($q.when(responseData));

      adminConfigApi.get(domainId, query)
        .then(function(data) {
          expect(data).to.deep.equal(responseData);
          expect(esnConfigApi.getDomainConfigurations).to.have.been.calledWith(domainId, query);
          done();
        });

      $rootScope.$digest();
    });

    it('should support getting platform configurations', function(done) {
      var domainId = ADMIN_MODE.platform;
      var query = [{ name: 'a module name', keys: ['a config key'] }];
      var responseData = 'some_data';

      esnConfigApi.getPlatformConfigurations = sinon.stub().returns($q.when(responseData));

      adminConfigApi.get(domainId, query)
        .then(function(data) {
          expect(data).to.deep.equal(responseData);
          expect(esnConfigApi.getPlatformConfigurations).to.have.been.calledWith(query);
          done();
        });

      $rootScope.$digest();
    });

  });

  describe('The set fn', function() {
    it('should call esnConfigApi to set domain configurations', function(done) {
      var domainId = 'domain123';
      var query = [{
        name: 'a module name',
        configurations: [{
          name: 'a config key',
          value: 'a config value'
        }]
      }];

      esnConfigApi.setDomainConfigurations = sinon.stub().returns($q.when());

      adminConfigApi
        .set(domainId, query)
        .then(function() {
          expect(esnConfigApi.setDomainConfigurations).to.have.been.calledWith(domainId, query);
          done();
        });

      $rootScope.$digest();
    });

    it('should support setting platform configurations', function(done) {
      var domainId = ADMIN_MODE.platform;
      var query = [{
        name: 'a module name',
        configurations: [{
          name: 'a config key',
          value: 'a config value'
        }]
      }];

      esnConfigApi.setPlatformConfigurations = sinon.stub().returns($q.when());

      adminConfigApi
        .set(domainId, query)
        .then(function() {
          expect(esnConfigApi.setPlatformConfigurations).to.have.been.calledWith(query);
          done();
        });

      $rootScope.$digest();
    });
  });

  describe('The generateJwtKeypair fn', function() {

    it('should send POST request to the right endpoint', function(done) {
      $httpBackend.expectPOST('/admin/api/configuration/generateJwtKeyPair').respond(200);

      adminConfigApi.generateJwtKeyPair().then(done.bind(null, null), done.bind(null, 'should resolve'));

      $httpBackend.flush();
    });

  });

  describe('The generateJwtToken fn', function() {
    it('should send POST request to the right endpoint', function(done) {
      var domainId = 'domain123';

      $httpBackend.expectPOST('/admin/api/configuration/domains/' + domainId + '/generateJwtToken').respond(200);

      adminConfigApi.generateJwtToken(domainId).then(done.bind(null, null), done.bind(null, 'should resolve'));

      $httpBackend.flush();
    });
  });
});
