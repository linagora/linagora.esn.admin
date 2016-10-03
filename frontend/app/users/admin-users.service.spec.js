'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminUsersService', function() {
  var adminUsersService, ADMIN_USER_EVENTS, domainAPI;
  var $rootScope;
  var domainId;

  beforeEach(function() {
    angular.mock.module('linagora.esn.admin');

    angular.mock.inject(function(_$rootScope_, _adminUsersService_, _ADMIN_USERS_EVENTS_, _domainAPI_) {
      $rootScope = _$rootScope_;
      adminUsersService = _adminUsersService_;
      ADMIN_USER_EVENTS = _ADMIN_USERS_EVENTS_;
      domainAPI = _domainAPI_;

      domainId = '123456';
    });
  });

  describe('The createMember fn', function() {
    var userMock;

    beforeEach(function() {
      userMock = {key: 'value'};
    });

    it('should call domainAPI.createMember to create member', function(done) {
      domainAPI.createMember = sinon.stub().returns($q.when({data: userMock}));
      $rootScope.$broadcast = sinon.spy();

      adminUsersService.createMember(domainId, userMock)
        .then(function() {
          expect(domainAPI.createMember).to.have.been.calledWith(domainId, userMock);
          expect($rootScope.$broadcast).to.have.been.calledWith(ADMIN_USER_EVENTS.CREATE, userMock);
          done();
        });

      $rootScope.$digest();
    });
  });
});
