'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminConfigApi Angular service', function() {

  var $httpBackend;
  var adminConfigApi, Restangular, ADMIN_MODE;

  beforeEach(module('linagora.esn.admin'));

  beforeEach(inject(function(_$httpBackend_, _adminConfigApi_, _Restangular_, _ADMIN_MODE_) {
    $httpBackend = _$httpBackend_;
    adminConfigApi = _adminConfigApi_;
    Restangular = _Restangular_;
    ADMIN_MODE = _ADMIN_MODE_;
  }));

  describe('The get fn', function() {

    it('should return response data on 200 success', function(done) {
      var domainId = 'domain123';
      var query = { key: 'value' };
      var responseData = 'some_data';

      $httpBackend.expectPOST('/admin/api/configuration/domains/' + domainId, query).respond(200, responseData);
      Restangular.stripRestangular = sinon.stub().returns(responseData);

      adminConfigApi.get(domainId, query)
        .then(function(data) {
          expect(data).to.deep.equal(responseData);
          done();
        });

      $httpBackend.flush();
    });

    it('should return an Error if respose.status is not 200', function(done) {
      var domainId = 'domain123';
      var query = { key: 'value' };

      $httpBackend.expectPOST('/admin/api/configuration/domains/' + domainId, query).respond(201);

      adminConfigApi.get(domainId, query)
        .catch(function(err) {
          expect(err).to.exist;
          done();
        });

      $httpBackend.flush();
    });

    it('should send POST to right endpoint to get platform configurations', function() {
      var domainId = ADMIN_MODE.platform;
      var query = { key: 'value' };

      $httpBackend.expectPOST('/admin/api/configuration', query).respond(200);

      adminConfigApi.get(domainId, query);

      $httpBackend.flush();
    });

  });

  describe('The set fn', function() {
    it('should resolve on success', function(done) {
      var domainId = 'domain123';
      var query = { key: 'value' };

      $httpBackend.expectPUT('/admin/api/configuration/domains/' + domainId, query).respond(204);

      adminConfigApi.set(domainId, query).then(done.bind(null, null), done.bind(null, 'should resolve'));

      $httpBackend.flush();
    });

    it('should reject on failure', function(done) {
      var domainId = 'domain123';
      var query = { key: 'value' };

      $httpBackend.expectPUT('/admin/api/configuration/domains/' + domainId, query).respond(500);

      adminConfigApi.set(domainId, query).then(done.bind(null, 'should reject'), done.bind(null, null));

      $httpBackend.flush();
    });

    it('should send PUT to right endpoint to change platform configurations', function() {
      var domainId = ADMIN_MODE.platform;
      var query = { key: 'value' };

      $httpBackend.expectPUT('/admin/api/configuration', query).respond(204);

      adminConfigApi.set(domainId, query);

      $httpBackend.flush();
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
