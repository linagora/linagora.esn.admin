module.exports = {
  AUTOCONF_ACCOUNT_TEMPLATE: {
    imap: {
      prettyName: 'OpenPaas (<%= user.preferredEmail %>)',
      hostName: '',
      username: '<%= user.preferredEmail %>',
      port: 143,
      socketType: '2'
    },
    smtp: {
      description: 'OpenPaas SMTP (<%= user.preferredEmail %>)',
      hostname: '',
      username: '<%= user.preferredEmail %>',
      port: 587,
      socketType: '2'
    },
    identities: [{
      identityName: 'Default (<%= user.preferredEmail %>)',
      email: '<%= user.preferredEmail %>',
      fullName: '<%= user.firstname %> <%= user.lastname %>',
      organization: '',
      autoQuote: true,
      replyOnTop: '1',
      sigBottom: false,
      sigOnForward: true,
      sigOnReply: true,
      attachSignature: false,
      htmlSigText: '',
      htmlSigFormat: true,
      fccFolder: '%serverURI%/Sent',
      draftFolder: '%serverURI%/Drafts'
    }]
  },
  AUTOCONF_TEMPLATE: {
    accounts: [],
    addons: [{
      id: '{e2fda1a4-762b-4020-b5ad-a41df1933103}',
      name: 'Lightning',
      versions: [
        {
          version: '4.7',
          minAppVersion: '45',
          maxAppVersion: '50',
          platforms: [{
            platform: 'Linux',
              url: 'https://addons.mozilla.org/thunderbird/downloads/file/430153/lightning-4.7-sm+tb-linux.xpi'
          }]
        },
        {
          version: '6.2',
          minAppVersion: '50',
          maxAppVersion: '60',
          platforms: [{
            platform: 'Linux',
            url: 'https://addons.thunderbird.net/thunderbird/downloads/file/1012344/lightning-6.2.5-sm+tb.xpi'
          }]
        },
        {
          version: '68',
          minAppVersion: '68',
          platforms: [{
            platform: 'Linux',
            url: 'https://addons.thunderbird.net/thunderbird/downloads/file/1015258/lightning-68.0-tb.xpi'
          }]
        }
      ]
    }, {
      id: 'cardbook@vigneau.philippe',
      name: 'CardBook',
      versions: [
        {
          version: '16.7',
          maxAppVersion: '59',
          platforms: [{
            platform: 'Linux',
            url: 'https://addons.mozilla.org/thunderbird/downloads/file/579999/cardbook-16.7-tb.xpi'
          }]
        },
        {
          version: '33.2',
          minAppVersion: '60',
          platforms: [{
            platform: 'Linux',
            url: 'https://addons.thunderbird.net/thunderbird/downloads/file/1012114/cardbook-33.2-tb.xpi'
          }]
        },
        {
          version: '42.9',
          minAppVersion: '68',
          platforms: [{
            platform: 'Linux',
            url: 'https://addons.thunderbird.net/thunderbird/downloads/latest/cardbook/addon-634298-latest.xpi'
          }]
        }
      ]
    }],
    preferences: [{
      name: 'app.update.enabled',
      value: false,
      overwrite: true
    }, {
      name: 'extensions.update.enabled',
      value: true,
      overwrite: true
    }, {
      name: 'extensions.cardbook.firstOpen',
      value: false
    }, {
      name: 'extensions.cardbook.exclusive',
      value: false
    }, {
      name: 'extensions.cardbook.firstRun',
      value: false
    }]
  }
};
