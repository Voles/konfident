(function () {
  'use strict';

  var gulp    = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      karma   = require('karma').server;

  gulp.task('serve', function () {
    plugins.connect.server({
      root: 'app',
      livereload: true
    });
  });

  gulp.task('jshint', function () {
    return gulp
      .src('app/js/**/*.js')
      .pipe(plugins.jshint('.jshintrc'))
      .pipe(plugins.jshint.reporter('jshint-stylish', { verbose: true }));
  });

  gulp.task('ngAnnotate', function () {
    return gulp.src('app/js/**/*.js')
      .pipe(plugins.ngAnnotate())
      .pipe(gulp.dest('dist'));
  });

  gulp.task('test', function () {
    return karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, function (err) {
      process.exit(err ? 1 : 0);
    });
  });

  gulp.task('build', ['jshint', 'test', 'ngAnnotate']);
  gulp.task('default', ['build']);

}());