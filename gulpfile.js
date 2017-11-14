var gulp        = require('gulp');
var sass        = require('gulp-sass');
var plumber     = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var sourcemaps  = require('gulp-sourcemaps');

var handleError = function(err) {
  console.log(err.toString());
  this.emit('end');
};

gulp.task('serve', function () {
  browserSync.init({
    server: "./",
    notify: false
  });
});

//TASK DO KOMPILOWANIA
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/main.scss')
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested'
    }) //nested,  expanded, compact, compressed
    .on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/css'))
    .pipe(browserSync.stream({match: './src/**/*.css'}));
});

//TASK DO OBSERWOWANIA
gulp.task('watch', function(){
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', function() {
  console.log('Uruchamiam gulpa - zadanie domyślne');
  gulp.start(['serve', 'watch']);
});
