'use strict';

angular.module('linagora.esn.admin')

  .constant('ADMIN_MODULES', {
    'linagora.esn.unifiedinbox': {
      title: 'Unified Inbox',
      icon: 'mdi-email',
      template: 'admin-modules-inbox',
      homePage: 'unifiedinbox',
      configurations: [
        'view', 'api', 'uploadUrl', 'downloadUrl', 'isJmapSendingEnabled',
        'isSaveDraftBeforeSendingEnabled', 'composer.attachments', 'maxSizeUpload',
        'twitter.tweets', 'swipeRightAction', 'drafts']
    },
    'linagora.esn.contact': {
      title: 'Contact',
      icon: 'mdi-account-multiple',
      homePage: 'contact',
      configurations: []
    },
    'linagora.esn.calendar': {
      title: 'Calendar',
      icon: 'mdi-calendar',
      homePage: 'calendar.main',
      configurations: []
    }
  });
