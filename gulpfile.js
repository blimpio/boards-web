var Q = require('q'),
    git = require('git-rev'),
    dotenv = require('dotenv'),
    brunch = require('brunch'),
    runSequence = require('run-sequence'),

    s3 = require('gulp-s3'),
    gzip = require('gulp-gzip'),
    gulp = require('gulp'),
    karma = require('gulp-karma'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    gitRename = require('gulp-rename-git'),

    aws = {};

    s3Options = {
      headers: {
        'Cache-Control': 'max-age=315360000, no-transform, public',
        'Content-Encoding': 'gzip'
      }
    },

    environment = process.env.ENV || 'staging';

dotenv.load();

if (environment === 'staging') {
  aws = {
    key: process.env.STAGING_AWS_S3_ACCESS_KEY_ID,
    secret: process.env.STAGING_AWS_S3_SECRET_ACCESS_KEY,
    bucket: process.env.STAGING_AWS_S3_BUCKET_NAME
  };
} else if (environment === 'production') {
  aws = {
    key: process.env.PRDUCTION_AWS_S3_ACCESS_KEY_ID,
    secret: process.env.PRDUCTION_AWS_S3_SECRET_ACCESS_KEY,
    bucket: process.env.PRDUCTION_AWS_S3_BUCKET_NAME
  };
}

gulp.task('build:staging', function() {
  var deferred = Q.defer();

  brunch.build({}, function() {
    deferred.resolve();
  });

  return deferred.promise;
});

gulp.task('build:production', function() {
  var deferred = Q.defer();

  brunch.build({production: true}, function() {
    deferred.resolve();
  });

  return deferred.promise;
});

gulp.task('test:staging', ['build:staging'], function() {
  return gulp.src([
    'test/**/*-test.js'
  ]).pipe(karma({
    action: 'run',
    configFile: 'karma.conf.coffee'
  }));
});

gulp.task('test:production', ['build:production'], function() {
  return gulp.src([
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
      var dirname = (path.dirname === '.' ? '' : path.dirname);
      path.dirname = '/' + gitHash + '/js/' + dirname;
    }))

    .pipe(gzip({append: false}))
    .pipe(s3(aws, s3Options));
});

gulp.task('deploy:css', function() {
  return gulp.src([
      'public/css/*'
    ])

    .pipe(gitRename(function(path, gitHash) {
      var dirname = (path.dirname === '.' ? '' : path.dirname);
      path.dirname = '/' + gitHash + '/css/' + dirname;
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
      var dirname = (path.dirname === '.' ? '' : path.dirname);
      path.dirname = '/' + gitHash + '/images/' + dirname;
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
  var build = 'build:' + environment;
  runSequence('deploy:summary', build, 'deploy:js', 'deploy:css', 'deploy:images', cb);
});
