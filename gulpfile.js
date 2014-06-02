var Q = require('q'),
    git = require('git-rev'),
    gulp = require('gulp'),
    karma = require('gulp-karma'),
    gutil = require('gulp-util'),
    brunch = require('brunch'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    gitRename = require('gulp-rename-git'),
    s3 = require('gulp-s3'),
    gzip = require('gulp-gzip'),
    environment = process.env.ENV || 'staging',
    aws = require('./aws-config')[environment];

var s3Options = {
  headers: {
    'Cache-Control': 'max-age=315360000, no-transform, public',
    'Content-Encoding': 'gzip'
  }
};

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
  return gulp.src([
      'public/js/*'
    ])

    .pipe(gitRename(function(path, gitHash) {
      path.dirname = '/' + gitHash + '/js/';
    }))

    .pipe(gzip({append: false}))
    .pipe(s3(aws, s3Options));
});

gulp.task('deploy:css', function() {
  return gulp.src([
      'public/css/*'
    ])

    .pipe(gitRename(function(path, gitHash) {
      path.dirname = '/' + gitHash + '/css/';
    }))

    .pipe(gzip({append: false}))
    .pipe(s3(aws, s3Options));
});

gulp.task('deploy:images', function() {
  return gulp.src([
      'public/images/**'
    ])

    .pipe(imagemin())

    .pipe(gitRename(function(path, gitHash) {
      path.dirname = '/' + gitHash + '/images/';
    }))

    .pipe(gzip({append: false}))
    .pipe(s3(aws, s3Options));
});

gulp.task('deploy:summary', function() {
  var deferred = Q.defer();

  git.short(function(hash) {
    gutil.log('Environment:', gutil.colors.magenta(environment));
    gutil.log('Deploying to AWS bucket:', gutil.colors.magenta(aws.bucket));
    gutil.log('BOARDS_WEB_CLIENT_VERSION=' + gutil.colors.magenta(hash));
    deferred.resolve();
  });

  return deferred.promise;
});

gulp.task('deploy', function(cb) {
  runSequence('deploy:summary', 'build:prod', 'deploy:js', 'deploy:css', 'deploy:images', cb);
});
