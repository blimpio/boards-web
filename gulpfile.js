var exec = require('child_process').exec,

    gulp = require('gulp'),
    size = require('gulp-size'),
    concat = require('gulp-concat')

gulp.task('build_tests', function() {
  return gulp.src('./test/**/!(tests)**.js')
    .pipe(concat('tests.js'))
    .pipe(size())
    .pipe(gulp.dest('./test'))
});

gulp.task('test', ['build_tests'], function() {
  var path = './node_modules/mocha-phantomjs/bin/mocha-phantomjs';
  var command = '/test/index.html';

  exec(path + ' ' + command, function (error, stdout, stderr) {
    if (stdout) {
      console.log(stdout);
    } else if (stderr) {
      console.log(stderr);
    } else if (error) {
      console.log(error);
    }
  });
});
