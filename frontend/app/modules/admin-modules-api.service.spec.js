'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminModulesApi service', function() {
  var adminModulesApi, adminConfigApi, esnModuleRegistry;
  var ADMIN_MODULES;
  var DOMAIN_ID = 'domain123';

  beforeEach(module('linagora.esn.admin'));

  beforeEach(function() {
    angular.mock.inject(function(_adminConfigApi_, _adminModulesApi_, _esnModuleRegistry_, _ADMIN_MODULES_) {
      adminConfigApi = _adminConfigApi_;
      adminModulesApi = _adminModulesApi_;
      esnModuleRegistry = _esnModuleRegistry_;
      ADMIN_MODULES = _ADMIN_MODULES_;
    });

    esnModuleRegistry.getAll = sinon.stub().returns({});
  });

  var getQueryFromAdminModules = function(modules) {
    var query = [];

    angular.forEach(modules, function(module, name) {
      query.push({
        name: name,
        keys: module.configurations || []
      });
    });

    return query;
  };

  describe('The getModuleMetadata fn', function() {
    it('should call esnModuleRegistry.getAll', function() {

      adminModulesApi.getModuleMetadata();

      expect(esnModuleRegistry.getAll).to.have.been.calledOnce;
    });

    it('should cache modulesMetadata if it was defined', function() {
      adminModulesApi.getModuleMetadata(); // Init modulesMetadata

      adminModulesApi.getModuleMetadata();

      expect(esnModuleRegistry.getAll).to.have.been.calledOnce;
    });
  });

  describe('The get fn', function() {
    var modulesmetadataMock;

    beforeEach(function() {
      modulesmetadataMock = {
        'linagora.esn.unifiedinbox': {
          title: 'Unified Inbox',
          homePage: 'unifiedinbox',
          configurations: ADMIN_MODULES['linagora.esn.unifiedinbox'].configurations
        },
        'linagora.esn.contact': {
          title: 'Contact',
          homePage: 'contact'
        }
      };

      esnModuleRegistry.getAll = sinon.stub().returns(modulesmetadataMock);
    });

    it('should call adminConfigApi.get', function() {
      var getConfig = sinon.spy(adminConfigApi, 'get');
      var query = getQueryFromAdminModules(modulesmetadataMock);

      adminModulesApi.get(DOMAIN_ID);

      expect(getConfig).to.have.been.calledOnce;
      expect(getConfig).to.have.been.calledWith(DOMAIN_ID, query);
    });
  });

  describe('The set fn', function() {
    it('should call adminConfigApi.set', function() {
      var setChange = sinon.spy(adminConfigApi, 'set');
      var query = [{name: 'value'}];

      adminModulesApi.set(DOMAIN_ID, query);

      expect(setChange).to.have.been.calledOnce;
      expect(setChange).to.have.been.calledWith(DOMAIN_ID, query);
    });

  });
});
