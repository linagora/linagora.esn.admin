'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminRolesService', function() {
  var $rootScope;
  var adminRolesService, domainAPI, domainSearchMembersProvider;
  var ADMIN_SEARCH_LIMIT;
  var DOMAIN_ID = '123456';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$rootScope_, _adminRolesService_, _domainAPI_, _domainSearchMembersProvider_, _ADMIN_SEARCH_LIMIT_) {
      $rootScope = _$rootScope_;
      adminRolesService = _adminRolesService_;
      domainAPI = _domainAPI_;
      domainSearchMembersProvider = _domainSearchMembersProvider_;
      ADMIN_SEARCH_LIMIT = _ADMIN_SEARCH_LIMIT_;
    });
  });

  describe('The getAdministrators fn', function() {
    it('should call domainAPI.getAdministrators', function(done) {
      domainAPI.getAdministrators = sinon.stub().returns($q.when({data: []}));

      adminRolesService.init(DOMAIN_ID);

      adminRolesService.getAdministrators()
        .then(function() {
          expect(domainAPI.getAdministrators).to.have.been.calledWith(DOMAIN_ID);
          done();
        });

      $rootScope.$digest();
    });
  });

  describe('The addAdministrators fn', function() {
    it('should call domainAPI.addAdministrators', function(done) {
      var _administrators = [{_id: 'user1'}, {_id: 'user2'}];

      adminRolesService.init(DOMAIN_ID);

      domainAPI.getAdministrators = function() {
        return $q.when({data: []});
      };
      domainAPI.addAdministrators = sinon.stub().returns($q.when());

      adminRolesService.getAdministrators().then(function() {
        adminRolesService.addAdministrators(_administrators)
          .then(function() {
            expect(domainAPI.addAdministrators).to.have.been.calledWith(DOMAIN_ID, ['user1', 'user2']);
            done();
          });
      });

      $rootScope.$digest();
    });
  });

  describe('The removeAdministrator fn', function() {

    it('should call domainAPI to remove administrator and remove him from cache on success', function(done) {
      var admin1 = { _id: 1 };
      var admin2 = { _id: 2 };

      domainAPI.getAdministrators = function() {
        return $q.when({ data: [admin1, admin2] });
      };
      domainAPI.removeAdministrator = sinon.stub().returns($q.when());

      adminRolesService.init(DOMAIN_ID);

      adminRolesService.getAdministrators()
        .then(function() {
          return adminRolesService.removeAdministrator(admin1);
        })
        .then(adminRolesService.getAdministrators)
        .then(function(cachedAdministrators) {
          expect(cachedAdministrators.length).to.equal(1);
          expect(cachedAdministrators[0]).to.deep.equal(admin2);

          expect(domainAPI.removeAdministrator).to.have.been.calledWith(DOMAIN_ID, admin1._id);
          done();
        });

      $rootScope.$digest();
    });

  });

  describe('The searchAdministratorCandidates fn', function() {
    it('should call domainSearchMembersProvider', function(done) {
      var serchProvider = {
        searchAttendee: sinon.stub().returns($q.when([]))
      };
      var query = 'abc';

      adminRolesService.init(DOMAIN_ID);

      domainSearchMembersProvider.get = sinon.stub().returns(serchProvider);

      adminRolesService.searchAdministratorCandidates(query)
        .then(function() {
          expect(domainSearchMembersProvider.get).to.have.been.calledWith(DOMAIN_ID);
          expect(serchProvider.searchAttendee).to.have.been.calledWith(query, ADMIN_SEARCH_LIMIT);
          done();
        });

      $rootScope.$digest();
    });
  });
});
