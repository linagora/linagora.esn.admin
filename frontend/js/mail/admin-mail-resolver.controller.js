'use strict';

angular.module('linagora.esn.admin')

.controller('adminMailResolverController', function() {
  var self = this;
  self.options = [];

  if (self.resolver) {
    angular.forEach(self.resolver.options, function(value, key) {
      this.push({key: key, value: value});
    }, self.options);
  }

  self.addOption = function() {
    self.options.push({});
    self.qualifyResolver();
  };

  self.deleteOption = function($index) {
    self.options.splice($index, 1);
    self.qualifyResolver();
  };

  self.qualifyResolver = function() {
    self.resolver.options = {};

    angular.forEach(self.options, function(option) {
      self.resolver.options[option.key] = option.value;
    });
  };
});
