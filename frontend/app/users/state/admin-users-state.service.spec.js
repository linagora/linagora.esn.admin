'use strict';

/* global chai, sinon: false */

var expect = chai.expect;

describe('The adminUsersStateService', function() {
  var $rootScope, userApi, adminUsersStateService;
  var ADMIN_USER_ACTIONS_MOCK;

  beforeEach(function() {
    module('linagora.esn.admin');

    ADMIN_USER_ACTIONS_MOCK = {
      action1: {
        name: 'action1',
        label: 'Action1'
      },
      action2: {
        name: 'action2',
        label: 'Action2'
      },
      action3: {
        name: 'action3',
        label: 'Action3'
      }
    };

    module(function($provide) {
      $provide.constant('ADMIN_USER_ACTIONS', ADMIN_USER_ACTIONS_MOCK);
    });

    inject(function(
      _$rootScope_,
      _userApi_,
      _adminUsersStateService_
    ) {
      $rootScope = _$rootScope_;
      userApi = _userApi_;
      adminUsersStateService = _adminUsersStateService_;
    });
  });

  describe('The getUserStates function', function() {
    it('should return states of a user', function() {
      var user = {
        states: [
          { name: 'action1', value: 'enabled' },
          { name: 'action2', value: 'disabled' }
        ]
      };
      var states = adminUsersStateService.getUserStates(user);

      expect(states).to.deep.equal([
        { name: 'action1', value: 'enabled', label: 'Action1' },
        { name: 'action2', value: 'disabled', label: 'Action2' },
        { name: 'action3', value: 'enabled', label: 'Action3' }
      ]);
    });
  });

  describe('The setUserStates function', function() {
    it('should reject if failed to update user states', function() {
      var userId = '123';
      var states = [{ name: 'foo', value: 'enabled' }];

      userApi.setUserStates = sinon.stub().returns($q.reject());

      adminUsersStateService.setUserStates(userId, states)
        .catch(function() {
          expect(userApi.setUserStates).to.have.been.calledWith(userId, states);
        });

      $rootScope.$digest();
    });

    it('should resolve if success to update user states', function() {
      var userId = '123';
      var states = [{ name: 'foo', value: 'enabled' }];

      userApi.setUserStates = sinon.stub().returns($q.when());

      adminUsersStateService.setUserStates(userId, states);

      $rootScope.$digest();

      expect(userApi.setUserStates).to.have.been.calledWith(userId, states);
    });
  });
});
