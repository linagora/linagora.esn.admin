'use strict';

module.exports = function(grunt) {

  var frontendFiles = ['frontend/js/**/*.js'];
  var backendFiles = ['backend/**/*.js'];
  var allFiles = frontendFiles.concat(backendFiles).concat(['test/**/*.js', 'index.js', 'Gruntfile.js']);

  grunt.initConfig({
    karma: {
      unit: {
        configFile: './test/config/karma.conf.js',
        browsers: ['PhantomJS']
      }
    },
    eslint: {
      target: allFiles
    }
  });


  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('linters', ['eslint']);
  grunt.registerTask('test-frontend', ['karma:unit']);
  grunt.registerTask('test', ['linters', 'test-frontend']);

  grunt.registerTask('default', ['test']);
};
