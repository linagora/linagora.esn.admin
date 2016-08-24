'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesController', function(asyncAction, rejectWithErrorNotification, _) {
  var oldFeaturesConfigs;
  var exampleJson =
    {
      name : 'linagora.esn.unifiedinbox',
      configurations : [
        {
          name : 'api',
          value : 'https://172.17.0.2/jmap/79a87b7e-41c4-11e6-b11d-0242ac110002/'
        },
        {
          name : 'view',
          value : 'threads'
        },
        {
          name : 'uploadUrl',
          value : 'https://172.17.0.2/upload/79a87b7e-41c4-11e6-b11d-0242ac110002/'
        },
        {
          name : 'isJmapSendingEnabled',
          value : true
        },
        {
          name : 'isSaveDraftBeforeSendingEnabled',
          value : false
        },
        {
          name: 'maxSizeUpload',
          value : 20971500
        },
        {
          name : 'composer.attachments',
          value : true
        },
        {
          name : 'twitter.tweets',
          value : true
        },
        {
          name : 'swipeRightAction',
          value : 'markAsRead'
        }
      ]
    }; // fake data

  var self = this;

  self.inbox = exampleJson;

  self.getFeature = function(moduleName) {
    return exampleJson.configurations;
  };

  oldFeaturesConfigs = angular.copy(self.inbox);

  self.save = function(form) {

    if (angular.equals(oldFeaturesConfigs, self.inbox)) {
      return rejectWithErrorNotification('Nothing change to update!');
    }

    if (form && form.$valid) {
      return _saveFeaturesConfigured(self.inbox);
    }

    return rejectWithErrorNotification('Form is invalid!');
  };

  function _saveFeaturesConfigured(featureConfigs) {
    console.log(featureConfigs);
  }
});
