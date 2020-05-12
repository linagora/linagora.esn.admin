'use strict';

const AwesomeModule = require('awesome-module');
const Dependency = AwesomeModule.AwesomeModuleDependency;
const path = require('path');
const glob = require('glob-all');
const FRONTEND_JS_PATH = __dirname + '/frontend/app/';
const FRONTEND_JS_PATH_BUILD = __dirname + '/dist/';
const MODULE_NAME = 'admin';
const AWESOME_MODULE_NAME = 'linagora.esn.' + MODULE_NAME;

const adminModule = new AwesomeModule(MODULE_NAME, {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.wrapper', 'webserver-wrapper'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.esn-config', 'esn-config'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.email', 'email'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.auth', 'auth'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.logger', 'logger'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.domain', 'domainMiddleware'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.authorization', 'authorizationMW'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.configuration', 'configurationMW'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.helper', 'helperMW'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.platformadmins', 'platformadminsMW'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.i18n', 'i18n'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.jobqueue', 'jobqueue'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.elasticsearch', 'elasticsearch'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.user', 'user'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.esn-config', 'esn-config')
  ],

  states: {
    lib: function(dependencies, callback) {
      const libModule = require('./backend/lib')(dependencies);
      const api = require('./backend/webserver/api')(dependencies);

      const lib = {
        api,
        lib: libModule
      };

      return callback(null, lib);
    },

    deploy: function(dependencies, callback) {
      // Register the webapp
      const app = require('./backend/webserver/application')(dependencies);

      // Register every exposed endpoints
      app.use('/api', this.api);

      const webserverWrapper = dependencies('webserver-wrapper');

      // Register every exposed frontend scripts
      const frontendJsFilesFullPath = glob.sync([
        FRONTEND_JS_PATH_BUILD + '**/*.js',
        FRONTEND_JS_PATH_BUILD + '**/!(*spec).js'
      ]);
      const frontendJsFilesUri = frontendJsFilesFullPath.map(function(filepath) {
        return filepath.replace(FRONTEND_JS_PATH_BUILD, '');
      });

      webserverWrapper.injectAngularAppModules(MODULE_NAME, frontendJsFilesUri, [AWESOME_MODULE_NAME], ['esn'], {
        localJsFiles: frontendJsFilesFullPath
      });

      const lessFile = path.join(FRONTEND_JS_PATH, 'app.less');

      webserverWrapper.injectLess(MODULE_NAME, [lessFile], 'esn');
      webserverWrapper.addApp(MODULE_NAME, app);

      const libModule = require('./backend/lib')(dependencies);

      libModule.init();

      return callback();
    },

    start: function(dependencies, callback) {
      callback();
    }
  }
});

module.exports = adminModule;
