// Tests exist alongside the component they are testing with no separate test directory required;
// the build process should be sophisticated enough to handle this.
// via https://github.com/ngbp/ng-boilerplate#philosophy

module.exports = function (config) {

  var cfg = {
    bowerComponents : 'webapp/bower_components'
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    // files to load in the browser
    files: [
      // components
      cfg.bowerComponents + '/jquery/jquery.js',
      cfg.bowerComponents + '/jasmine-jquery/lib/jasmine-jquery.js',
      cfg.bowerComponents + '/angular/angular.js',
      cfg.bowerComponents + '/angular-route/angular-route.js',
      cfg.bowerComponents + '/angular-mocks/angular-mocks.js',
      cfg.bowerComponents + '/angular-sanitize/angular-sanitize.js',

      'webapp/js/app.js',
      'webapp/js/**/*.js'
    ],

    // files to exclude
    exclude: [
      'app/**/e2e/*.js'
    ],

    // generate js files from html templates to expose them during testing
    preprocessors: {
      '**/*.html': 'ng-html2js'
    },

    // https://github.com/karma-runner/karma-ng-html2js-preprocessor#configuration
    ngHtml2JsPreprocessor: {
      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'templates'
    },

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    port: 9876,
    browsers: ['PhantomJS'],
    reporters: 'dots'
  });
};