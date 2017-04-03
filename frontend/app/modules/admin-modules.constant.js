'use strict';

angular.module('linagora.esn.admin')

  .constant('ADMIN_MODULES', {
    'linagora.esn.unifiedinbox': {
      template: 'admin-modules-inbox',
      configurations: [
        'view', 'api', 'uploadUrl', 'downloadUrl', 'isJmapSendingEnabled',
        'isSaveDraftBeforeSendingEnabled', 'composer.attachments', 'maxSizeUpload',
        'twitter.tweets', 'swipeRightAction', 'drafts']
    },
    'linagora.esn.contact': {
      configurations: []
    },
    'linagora.esn.calendar': {
      configurations: []
    }
  });
