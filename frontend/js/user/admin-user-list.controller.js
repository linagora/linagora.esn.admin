'use strict';

angular.module('linagora.esn.admin')

.controller('adminUserListController', function($scope, memberSearchConfiguration, domainAPI, usSpinnerService, ADMIN_USER_EVENTS) {
  var self = this;
  self.spinnerKey = 'memberSpinner';
  var opts = {
    offset: 0,
    limit: memberSearchConfiguration.searchLimit,
    search: ''
  };

  self.search = {
    running: false
  };
  self.members = [];
  self.restActive = false;
  self.error = false;

  function _updateMembersList() {
    self.error = false;
    if (self.restActive) {
      return;
    } else {
      self.restActive = true;
      self.search.running = true;
      self.search.count = 0;
      usSpinnerService.spin('memberSpinner');

      domainAPI.getMembers(self.domainId, opts)
        .then(function(data) {
          self.search.count = parseInt(data.headers('X-ESN-Items-Count'), 10);
          self.members = self.members.concat(data.data);
        }, function() {
          self.error = true;
        }).finally(function() {
          self.search.running = false;
          self.restActive = false;
          usSpinnerService.stop('memberSpinner');
        });
    }
  }

  self.init = function() {
    //initializes the view with a list of users of the domain
    _updateMembersList();
  };

  self.loadMoreElements = function() {
    if (self.members.length === 0 || self.members.length < self.search.count) {
      opts.offset = self.members.length;
      _updateMembersList();
    }
  };

  $scope.$on(ADMIN_USER_EVENTS.CREATE, function(event, user) {
    user.emails = user.accounts[0].emails;
    self.members.unshift(user);
  });

  self.init();
});
