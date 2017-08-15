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
      'frontend/components/dynamic-directive/dist/dynamic-directive.min.js',
      'frontend/components/restangular/dist/restangular.min.js',
      'frontend/components/sinon-chai/lib/sinon-chai.js',
      'node_modules/chai-shallow-deep-equal/chai-shallow-deep-equal.js',
      'node_modules/sinon/pkg/sinon.js',
      'test/unit-frontend/mocks/**/*.js',
      'frontend/app/**/*.module.js',
      'frontend/app/**/*.js',
      'frontend/app/**/*.pug'
    ],
    frameworks: ['mocha'],
    colors: true,
    singleRun: true,
    autoWatch: true,
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    reporters: ['coverage', 'spec'],
    preprocessors: {
      'frontend/app/**/!(*spec).js': ['coverage'],
      'frontend/app/**/*.pug': ['ng-jade2module']
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-ng-jade2module-preprocessor'
    ],

    coverageReporter: {type: 'text', dir: '/tmp'},

    ngJade2ModulePreprocessor: {
      stripPrefix: 'frontend',
      cacheIdFromPath: function(filepath) {
        var cacheId = filepath.replace(/.pug$/, '.html').replace(/^frontend/, '/admin');

        return cacheId;
      },
      prependPrefix: '/linagora.esn.admin',
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
