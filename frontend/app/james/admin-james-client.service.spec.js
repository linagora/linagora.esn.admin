'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminJamesQuota service', function() {
  beforeEach(function() {
    module('linagora.esn.admin');
  });

  describe('The httpTransport factory', function() {
    var $httpBackend, httpTransport;

    beforeEach(inject(function(_$httpBackend_, _httpTransport_) {
      $httpBackend = _$httpBackend_;
      httpTransport = _httpTransport_;
    }));

    describe('The get fn', function() {
      it('should GET on the given URL, passing the given headers', function(done) {
        $httpBackend.expectGET('/testing', function(headers) {
          expect(headers).to.shallowDeepEqual({ a: 'x', b: 1 });

          return true;
        }).respond(200);

        httpTransport.get('/testing', { a: 'x', b: 1 }).then(function() { done(); });

        $httpBackend.flush();
      });

      it('should parse the data as JSON and resolve the promise with it', function(done) {
        $httpBackend.expectGET('/testing').respond(200, '[["test",{"a":"b"}]]');

        httpTransport.get('/testing').then(function(data) {
          expect(data).to.deep.equal([['test', { a: 'b' }]]);

          done();
        });

        $httpBackend.flush();
      });

      it('should reject the promise if HTTP status code is not 200', function(done) {
        $httpBackend.expectGET('/testing').respond(400);

        httpTransport.get('/testing').catch(function() { done(); });

        $httpBackend.flush();
      });
    });

    describe('The put fn', function() {
      it('should PUT on the given URL, passing the given headers and serialize data as JSON', function(done) {
        $httpBackend.expectPUT('/testing', function(data) {
          expect(data).to.deep.equal('[0,1]');

          return true;
        }, function(headers) {
          expect(headers).to.shallowDeepEqual({ a: 'x', b: 1 });

          return true;
        }).respond(200);

        httpTransport.put('/testing', { a: 'x', b: 1 }, [0, 1]).then(function() { done(); });

        $httpBackend.flush();
      });

      it('should parse the data as JSON and resolve the promise with it', function(done) {
        $httpBackend.expectPUT('/testing').respond(200, '[["test",{"a":"b"}]]');

        httpTransport.put('/testing').then(function(data) {
          expect(data).to.deep.equal([['test', { a: 'b' }]]);

          done();
        });

        $httpBackend.flush();
      });

      it('should reject the promise if HTTP status code is not 200', function(done) {
        $httpBackend.expectPUT('/testing').respond(400);

        httpTransport.put('/testing').catch(function() { done(); });

        $httpBackend.flush();
      });
    });
  });

  describe('The adminJamesClientProvider factory', function() {
    var $rootScope, adminConfigApi, adminJamesClientProvider;
    var $windowMock, jamesClientInstanceMock;

    beforeEach(function() {
      jamesClientInstanceMock = {
        getQuota: function() { return $q.when({}); },
        setQuota: function() { return $q.when(); }
      };

      $windowMock = {
        james: {
          Client: function() {
            return jamesClientInstanceMock;
          }
        }
      };

      angular.mock.module(function($provide) {
        $provide.value('$window', $windowMock);
      });

      inject(function(_$rootScope_, _adminConfigApi_, _adminJamesClientProvider_) {
        $rootScope = _$rootScope_;
        adminConfigApi = _adminConfigApi_;
        adminJamesClientProvider = _adminJamesClientProvider_;
      });
    });

    describe('The get fn', function() {
      it('should return an instance of james client', function(done) {
        adminConfigApi.generateJwtToken = sinon.stub().returns($q.when({data: 'token'}));
        adminJamesClientProvider.get()
          .then(function(jamesClient) {
            expect(adminConfigApi.generateJwtToken).to.have.been.calledOnce;
            expect(jamesClient).to.deep.equal(jamesClientInstanceMock);
            done();
          });

        $rootScope.$digest();
      });

      it('should not call adminConfigApi.generateJwtToken if token is already cached', function(done) {
        adminConfigApi.generateJwtToken = sinon.stub().returns($q.when({data: 'token'}));
        adminJamesClientProvider.get()
          .then(function() {
            adminJamesClientProvider.get().then(function() {
              expect(adminConfigApi.generateJwtToken).to.have.been.calledOnce;
              done();
            });
          });

        $rootScope.$digest();
      });
    });
  });
});
