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
      'webapp/js/**/*.js',

      '**/*.html'
    ],

    // files to exclude
    exclude: [],

    // generate js files from html templates to expose them during testing
    preprocessors: {
      '**/*.html': 'ng-html2js',
      'webapp/js/**/*.js': 'coverage'
    },

    // https://github.com/karma-runner/karma-ng-html2js-preprocessor#configuration
    ngHtml2JsPreprocessor: {
      stripPrefix: 'webapp/',
      moduleName: 'templates'
    },

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    port: 9876,
    browsers: ['PhantomJS'],
    reporters: ['dots', 'coverage'],
    singleRun: true
  });
};