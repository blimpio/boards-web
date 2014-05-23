var Q = require('q'),
    s3 = require('gulp-s3'),
    git = require('git-rev'),
    gulp = require('gulp'),
    karma = require('gulp-karma'),
    brunch = require('brunch'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence');

gulp.task('build:dev', function() {
  var deferred = Q.defer();

  brunch.build({}, function() {
    deferred.resolve();
  });

  return deferred.promise;
});

gulp.task('build:prod', function() {
  var deferred = Q.defer();

  brunch.build({production: true}, function() {
    deferred.resolve();
  });

  return deferred.promise;
});

gulp.task('test:dev', ['build:dev'], function() {
  return gulp.src([
    'public/css/app.css',
    'public/js/app.js',
    'bower_components/handlebars/handlebars.js',
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
    'bower_components/handlebars/handlebars.js',
    'test/enviroment.js',
    'test/**/*-test.js'
  ]).pipe(karma({
    action: 'run',
    browsers: ['Chrome', 'Safari', 'Firefox'],
    configFile: 'karma.conf.coffee'
  }));
});

gulp.task('deploy:js', function() {
  var aws = require('./aws-config'),
      deferred = Q.defer();

  git.short(function (hash) {
    gulp.src([
      'public/js/*'
    ], {read: false})
    .pipe(s3(aws, {uploadPath: '/' + hash + '/js/'}))
    .on('close', function() {
      deferred.resolve();
    });
  });

  return deferred.promise;
});


gulp.task('deploy:css', function() {
  var aws = require('./aws-config'),
      deferred = Q.defer();

  git.short(function (hash) {
    gulp.src([
      'public/css/*'
    ], {read: false})
    .pipe(s3(aws, {uploadPath: '/' + hash + '/css/'}))
    .on('close', function() {
      deferred.resolve();
    });
  });

  return deferred.promise;
});

gulp.task('deploy:images', function() {
  var aws = require('./aws-config'),
      deferred = Q.defer();

  git.short(function (hash) {
    gulp.src([
      'public/images/**'
    ], {read: false})
    .pipe(imagemin())
    .pipe(s3(aws, {uploadPath: '/' + hash + '/images/'}))
    .on('close', function() {
      deferred.resolve();
    });
  });

  return deferred.promise;
});

gulp.task('deploy', function(cb) {
  runSequence('build:prod', 'deploy:js', 'deploy:css', 'deploy:images', cb);
});
