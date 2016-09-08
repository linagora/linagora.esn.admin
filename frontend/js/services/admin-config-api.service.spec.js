'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminConfigApi Angular service', function() {

  var $httpBackend;
  var adminConfigApi, Restangular;

  beforeEach(module('linagora.esn.admin'));

  beforeEach(inject(function(_$httpBackend_, _adminConfigApi_, _Restangular_) {
    $httpBackend = _$httpBackend_;
    adminConfigApi = _adminConfigApi_;
    Restangular = _Restangular_;
  }));

  describe('The get fn', function() {

    it('should return response data on 200 success', function(done) {
      var domainId = 'domain123';
      var query = { key: 'value' };
      var responseData = 'some_data';

      $httpBackend.expectPOST('/admin/api/configuration/domain/' + domainId, query).respond(200, responseData);
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

      $httpBackend.expectPOST('/admin/api/configuration/domain/' + domainId, query).respond(201);

      adminConfigApi.get(domainId, query)
        .catch(function(err) {
          expect(err).to.exist;
          done();
        });

      $httpBackend.flush();
    });

  });

  describe('The set fn', function() {
    it('should resolve on success', function(done) {
      var domainId = 'domain123';
      var query = { key: 'value' };

      $httpBackend.expectPUT('/admin/api/configuration/domain/' + domainId, query).respond(204);

      adminConfigApi.set(domainId, query).then(done.bind(null, null), done.bind(null, 'should resolve'));

      $httpBackend.flush();
    });

    it('should reject on failure', function(done) {
      var domainId = 'domain123';
      var query = { key: 'value' };

      $httpBackend.expectPUT('/admin/api/configuration/domain/' + domainId, query).respond(500);

      adminConfigApi.set(domainId, query).then(done.bind(null, 'should reject'), done.bind(null, null));

      $httpBackend.flush();
    });

  });
});
