'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesAutoCompleteController', function($element, elementScrollService, adminRolesService, _) {
  var self = this;

  self.search = adminRolesService.searchAdministratorCandidates;

  self.onTagAdding = function($tag) {
    return _.filter(self.newAdministrators, function(tag) {
      return angular.equals(tag.id, $tag.id);
    });
  };

  self.onTagAdded = function() {
    elementScrollService.autoScrollDown($element.find('div.tags'));
  };
});
