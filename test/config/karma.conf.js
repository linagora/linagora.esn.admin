'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../../',
    files: [
      'frontend/components/chai/chai.js',
      'frontend/components/lodash/dist/lodash.min.js',
      'frontend/components/jquery/dist/jquery.min.js',
      'frontend/components/angular/angular.js',
      'frontend/components/angular-ui-router/release/angular-ui-router.min.js',
      'frontend/components/angular-mocks/angular-mocks.js',
      'frontend/components/angular-component/dist/angular-component.min.js',
      'frontend/components/angular-messages/angular-messages.min.js',
      'frontend/components/angular-strap/dist/angular-strap.js',
      'frontend/components/angular-strap/dist/angular-strap.tpl.js',
      'frontend/components/dynamic-directive/dist/dynamic-directive.min.js',
      'frontend/components/restangular/dist/restangular.min.js',
      'frontend/components/sinon-chai/lib/sinon-chai.js',
      'frontend/components/angular-colorpicker-directive/js/color-picker.js',
      'frontend/components/restangular/dist/restangular.js',
      'node_modules/chai-shallow-deep-equal/chai-shallow-deep-equal.js',
      'node_modules/sinon/pkg/sinon.js',

      'node_modules/linagora-rse/frontend/js/modules/**/*.module.js',
      'node_modules/linagora-rse/frontend/js/modules/**/*.js',
      'node_modules/linagora-rse/frontend/js/*.js',
      'node_modules/linagora-rse/test/fixtures/code-generation/**/*.js',
      'node_modules/linagora-rse/frontend/views/modules/**/*.pug',
      { pattern: 'node_modules/linagora-rse/frontend/js/modules/i18n/i18n.config.js', watched: false, included: false, served: true },

      'node_modules/linagora.esn.resource/frontend/**/*.js',

      'test/unit-frontend/mocks/**/*.js',
      'frontend/app/**/*.module.js',
      'frontend/app/**/*.js',
      'frontend/app/**/*.pug'
    ],
    exclude: [
      'node_modules/linagora-rse/frontend/js/**/*.spec.js',
      'node_modules/linagora-rse/frontend/js/**/*.run.js',
      'node_modules/linagora.esn.resource/frontend/**/*.spec.js'
    ],
    frameworks: ['mocha'],
    colors: true,
    singleRun: true,
    autoWatch: true,
    // Disable ChromeHeadless causing problems for now
    // https://github.com/GoogleChrome/puppeteer/issues/1925
    browsers: ['FirefoxHeadless'/*,'ChromeHeadless'*/],
    customLaunchers: {
      FirefoxHeadless: {base: 'Firefox', flags: ['--headless']},
      ChromeHeadless: {base: 'Chrome', flags: ['--headless', '--disable-gpu']},
      Chrome_with_debugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9222'],
        debug: true
      }
    },
    reporters: ['coverage', 'spec'],
    preprocessors: {
      'frontend/app/**/!(*spec).js': ['coverage'],
      '**/*.pug': ['ng-jade2module']
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-coverage',
      'karma-spec-reporter',
      '@linagora/karma-ng-jade2module-preprocessor'
    ],

    coverageReporter: {type: 'text', dir: '/tmp'},

    ngJade2ModulePreprocessor: {
      stripPrefix: 'frontend',
      cacheIdFromPath: function(filepath) {
        var cacheId = filepath
          .replace(/.pug$/, '.html')
          .replace(/^frontend/, '/admin')
          .replace(/^node_modules\/linagora-rse\/frontend/, '');

        return cacheId;
      },
      prependPrefix: '/linagora.esn.admin',
      jadeRenderOptions: {
        basedir: require('path').resolve(__dirname, '../../node_modules/linagora-rse/frontend/views')
      },
      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('templates')
      jadeRenderConfig: {
        __: function(str) {
          return str;
        }
      },
      moduleName: 'jadeTemplates'
    }

  });
};
