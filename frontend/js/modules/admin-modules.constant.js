'use strict';

angular.module('linagora.esn.admin')

.constant('ADMIN_MODULES', {
  'linagora.esn.unifiedinbox': {
    title: 'Unified Inbox',
    template: 'admin-modules-inbox',
    configurations: [
      'view', 'api', 'uploadUrl', 'downloadUrl', 'isJmapSendingEnabled',
      'isSaveDraftBeforeSendingEnabled', 'composer.attachments', 'maxSizeUpload',
      'twitter.tweets', 'swipeRightAction']
  }
});
