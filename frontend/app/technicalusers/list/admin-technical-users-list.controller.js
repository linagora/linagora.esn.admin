(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .controller('adminTechnicalUsersListController', function($stateParams, esnTechnicalUserAPIClient, infiniteScrollHelper, ELEMENTS_PER_REQUEST) {
    var self = this;
    var DEFAULT_LIMIT = ELEMENTS_PER_REQUEST || 20;
    var options = {
      offset: 0,
      limit: DEFAULT_LIMIT
    };

    self.domainId = $stateParams.domainId;

    self.$onInit = $onInit;

    function $onInit() {
      self.loadMoreElements = infiniteScrollHelper(self, _loadNextItems, null, DEFAULT_LIMIT);
    }

    function _loadNextItems() {
      options.offset = self.elements.length;

      return esnTechnicalUserAPIClient.list(self.domainId, options);
    }
  });

})(angular);
