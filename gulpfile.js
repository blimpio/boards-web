var exec = require('child_process').exec;
var gulp = require('gulp');

gulp.task('test', function() {
  var path = './node_modules/mocha-phantomjs/bin/mocha-phantomjs';
  var command = '/test/index.html';

  exec(path + ' ' + command, function (error, stdout, stderr) {
    if (stdout) {
      console.log(stdout);
    } else if (stderr) {
      process.stderr.write(stderr);
    } else if (error) {
      process.stderr.write(error);
    }
  });
});
