'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesAutoCompleteController', function($element, elementScrollService, adminRolesService) {
  var self = this;

  self.search = search;
  self.onTagAdded = onTagAdded;

  init();

  function init() {
    adminRolesService.getAdministrators().then(function(administrators) {
      self.excludes = administrators.map(function(administrator) {
        return {
          id: administrator.id,
          objectType: 'user'
        };
      });
    });
  }

  function search(query) {
    return adminRolesService.searchAdministratorCandidates(query, self.excludes);
  }

  function onTagAdded($tag) {
    self.excludes.push({
      id: $tag.id,
      objectType: $tag.objectType
    });

    elementScrollService.autoScrollDown($element.find('div.tags'));
  }
});
