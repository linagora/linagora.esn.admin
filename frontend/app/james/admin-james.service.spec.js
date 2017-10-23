'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminJamesService', function() {

  var adminJamesService, jamesClientProvider, adminDomainConfigService;
  var $windowMock, $rootScope, jamesClientInstanceMock;
  var domain, serverUrl;

  beforeEach(function() {
    module('linagora.esn.admin');

    jamesClientInstanceMock = {};

    $windowMock = {
      james: {
        Client: function() {
          return jamesClientInstanceMock;
        }
      }
    };

    domain = { name: 'abc.com' };
    serverUrl = 'http://james.com';

    angular.mock.module(function($provide) {
      $provide.value('$window', $windowMock);
    });

    inject(function(
      _$rootScope_,
      _adminJamesService_,
      _jamesClientProvider_,
      _adminDomainConfigService_
    ) {
      $rootScope = _$rootScope_;
      adminJamesService = _adminJamesService_;
      jamesClientProvider = _jamesClientProvider_;
      adminDomainConfigService = _adminDomainConfigService_;

      jamesClientInstanceMock.createDomain = sinon.stub().returns($q.when());
      jamesClientProvider.get = sinon.stub().returns($q.when(jamesClientInstanceMock));
      adminDomainConfigService.get = sinon.stub().returns($q.when({ url: serverUrl }));
    });
  });

  describe('The createDomain method', function() {
    it('should reject if failed to create domain in James', function(done) {
      var error = new Error('something wrong');

      jamesClientInstanceMock.createDomain = sinon.stub().returns($q.reject(error));

      adminJamesService.createDomain(domain.name)
        .catch(function(err) {
          expect(adminDomainConfigService.get).to.have.been.calledOnce;
          expect(jamesClientInstanceMock.createDomain).to.have.been.calledOnce;
          expect(jamesClientInstanceMock.createDomain).to.have.been.calledWith(domain.name);
          expect(err.message).to.equal(error.message);

          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if successfully to create domain in James', function(done) {
      adminJamesService.createDomain(domain.name)
        .then(function() {
          expect(adminDomainConfigService.get).to.have.been.calledOnce;
          expect(jamesClientInstanceMock.createDomain).to.have.been.calledOnce;
          expect(jamesClientInstanceMock.createDomain).to.have.been.calledWith(domain.name);

          done();
        });

      $rootScope.$digest();
    });
  });

  describe('The getServerUrl function', function() {
    it('should reject if failed to get James server URL', function(done) {
      var error = new Error('something wrong');

      adminDomainConfigService.get = sinon.stub().returns($q.reject(error));

      adminJamesService.getServerUrl()
        .catch(function(err) {
          expect(adminDomainConfigService.get).to.have.been.calledOnce;
          expect(err.message).to.equal(error.message);

          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if successfully to get James server URL', function(done) {
      adminJamesService.getServerUrl()
        .then(function() {
          expect(adminDomainConfigService.get).to.have.been.calledOnce;

          done();
        });

      $rootScope.$digest();
    });
  });

  describe('The listDomains function', function() {
    it('should reject if failed to list domains in James', function(done) {
      var error = new Error('something wrong');

      jamesClientInstanceMock.listDomains = sinon.stub().returns($q.reject(error));

      adminJamesService.listDomains()
        .catch(function(err) {
          expect(jamesClientInstanceMock.listDomains).to.have.been.calledOnce;
          expect(err.message).to.equal(error.message);

          done();
        });

      $rootScope.$digest();
    });

    it('should resolve if successfully to list domains in James', function(done) {
      var domains = ['awesome.com'];

      jamesClientInstanceMock.listDomains = sinon.stub().returns($q.when(domains));

      adminJamesService.listDomains()
        .then(function(jamesDomains) {
          expect(jamesClientInstanceMock.listDomains).to.have.been.calledOnce;
          expect(jamesDomains).to.equal(domains);

          done();
        });

      $rootScope.$digest();
    });
  });
});
