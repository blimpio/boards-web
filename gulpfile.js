var gulp = require('gulp'),
    karma = require('gulp-karma'),
    brunch = require('brunch');

gulp.task('build:dev', function(cb) {
  brunch.build({}, function() {
    cb();
  });
});

gulp.task('build:prod', function(cb) {
  brunch.build({production: true}, function() {
    cb();
  });
});

gulp.task('test:dev', ['build:dev'], function() {
  return gulp.src([
    'public/css/app.css',
    'public/js/app.js',
    'test/enviroment.js',
    'test/**/*-test.js'
  ]).pipe(karma({
    action: 'run',
    configFile: 'karma.conf.coffee'
  }));
});

gulp.task('test:prod', ['build:prod'], function() {
  return gulp.src([
    'public/css/app.css',
    'public/js/app.js',
    'test/enviroment.js',
    'test/**/*-test.js'
  ]).pipe(karma({
    action: 'run',
    browsers: ['Chrome', 'Safari', 'Firefox'],
    configFile: 'karma.conf.coffee'
  }));
});
