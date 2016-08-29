'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The adminDomainConfigService service', function() {

  var $httpBackend;
  var adminDomainConfigService;
  var configsMock, domainId;

  beforeEach(function() {
    configsMock = [
      {
        name: 'mail',
        value: {
          mail: {
            noreply: 'no-reply@open-paas.org'
          },
          transport: {
            module: 'nodemailer-browser',
            config: {
              dir: '/tmp',
              browser: false
            }
          }
        }
      }
    ];

    domainId = 'domainId';

    angular.mock.module('linagora.esn.admin');
  });

  beforeEach(function() {
    angular.mock.inject(function(_adminDomainConfigService_, _$httpBackend_) {
      adminDomainConfigService = _adminDomainConfigService_;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('The get fn', function() {

    it('should return an Error if respose.status is not 200', function(done) {
      var configNames = ['mail'];
      var moduleName = 'core';

      $httpBackend.expectPOST('/admin/api/configuration/domain/' + domainId, {
        configNames: configNames,
        moduleName: moduleName
      }).respond(500, 'Error');

      adminDomainConfigService.get(domainId, configNames, moduleName)
        .catch(function(err) {
          expect(err).to.exist;
          done();
        });

      $httpBackend.flush();
    });

    it('should return an array of configurations of domain if respose.status is 200', function(done) {
      var configNames = ['mail'];
      var moduleName = 'core';

      $httpBackend.expectPOST('/admin/api/configuration/domain/' + domainId, {
        configNames: configNames,
        moduleName: moduleName
      }).respond(200, configsMock);

      adminDomainConfigService.get(domainId, configNames, moduleName)
        .then(function(configs) {
          expect(configs).to.shallowDeepEqual(configsMock);
          done();
        });

      $httpBackend.flush();
    });

    it('should return a configuration if configNames is not an array', function(done) {
      var configNames = 'mail';
      var moduleName = 'core';

      $httpBackend.expectPOST('/admin/api/configuration/domain/' + domainId, {
        configNames: [configNames],
        moduleName: moduleName
      }).respond(200, configsMock);

      adminDomainConfigService.get(domainId, configNames, moduleName)
        .then(function(config) {
          expect(config).to.deep.equal(configsMock[0].value);
          done();
        });

      $httpBackend.flush();
    });
  });

  describe('The set fn', function() {

    it('should return an Error if respose.status is not 200', function(done) {
      var moduleName = 'core';

      $httpBackend.expectPUT('/admin/api/configuration/domain/' + domainId, {
        configs: configsMock,
        moduleName: moduleName
      }).respond(500, 'Error');

      adminDomainConfigService.set(domainId, configsMock, moduleName)
        .catch(function(err) {
          expect(err).to.exist;
          done();
        });

      $httpBackend.flush();
    });

    it('should return an array of configurations of domain if respose.status is 200', function(done) {
      var moduleName = 'core';

      $httpBackend.expectPUT('/admin/api/configuration/domain/' + domainId, {
        configs: configsMock,
        moduleName: moduleName
      }).respond(200, configsMock);

      adminDomainConfigService.set(domainId, configsMock, moduleName)
        .then(function(configs) {
          expect(configs).to.deep.equal(configsMock);
          done();
        });

      $httpBackend.flush();
    });

    it('should still work if configs parameter as an object', function(done) {
      var moduleName = 'core';

      $httpBackend.expectPUT('/admin/api/configuration/domain/' + domainId, {
        configs: configsMock,
        moduleName: moduleName
      }).respond(200, configsMock);

      adminDomainConfigService.set(domainId, configsMock[0], moduleName)
        .then(function(configs) {
          expect(configs).to.deep.equal(configsMock);
          done();
        });

      $httpBackend.flush();
    });
  });
});
