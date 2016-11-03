'use strict';

angular.module('linagora.esn.admin')

.controller('adminSubheaderSaveButtonController', function(rejectWithErrorNotification) {
  var self = this;

  self.checkValidThenSubmit = function() {
    if (self.form && self.form.$valid) {
      return self.onClick().then(function() {
        self.form.$setPristine();
        self.form.$setUntouched();
      });
    }

    self.form.$setSubmitted();

    return rejectWithErrorNotification('Form is invalid!');
  };
});
