var gulp = require('gulp'),
    sass = require('gulp-sass'),
    fileinclude = require('gulp-file-include'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),    
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    urls = require('./package.json'),
    eslint = require('gulp-eslint');
    //jslint = require('gulp-jslint');
    //sourcemaps = require('gulp-sourcemaps'); - do użycia wyłącznie w projektach z automatycznym deploymentem - konflikty w git.


var suffix = '.min',
    dynamic = '.dynamic',
    jsName = 'service.js',

    HtmlSrc = 'src/html/**/*.html',
    HtmlDest = 'dist/',

    cssSrc = 'src/scss/**/*.scss',
    cssDistDev = 'dist/',
    cssDist = '../public/',

    jsSrc = 'src/js/**/*.js',
    jsDistDev = 'dist/js/',
    jsDist = '../public/js',
    jsMinFile = 'dist/js/*' + suffix + '.js',

    imgSrc = 'src/images/**/*.*',
    imgDestDev = 'dist/images/',
    imgDest = '../public/images';


//TASK DO BUDOWANIA HTML-i
gulp.task('html', function (done) {
      console.log('ZANOTOWANO ZMIANĘ W HTML ... generowanie w toku');
      gulp.src(HtmlSrc)
        .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
        .pipe(gulp.dest(HtmlDest))
        .pipe(browserSync.stream())
      console.log(' --------------------------------------------------\n|          WYGENEROWANO POMYŚLNIE HTML-e           |\n --------------------------------------------------');
      browserSync.reload();
      done();
});


//TASK DO OBRAZKÓW         !! 2DO: kompresja obrazków do dest!!
gulp.task('images', function () {
    console.log('ZANOTOWANO ZMIANĘ W IMAGES ... generowanie w toku');
    gulp.src(imgSrc)            
    .pipe(gulp.dest(imgDestDev))
    .pipe(gulp.dest(imgDest))
    .pipe(browserSync.stream());
    console.log(' ---------------------------------------------------\n|     WYGENEROWANO POMYŚLNIE PRODUKCYJNE OBRAZKI    |\n ---------------------------------------------------');
});


//TASK DO BUDOWANIA STYLI - OSOBNY DLA DEV i Z CLEAN CSS Na PROD
gulp.task('styles', function () {
    console.log('ZANOTOWANO ZMIANĘ W CSS ... generowanie w toku');
    gulp.src(cssSrc)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename({ suffix: suffix}))
        .pipe(gulp.dest(cssDistDev))
        .pipe(gulp.dest(cssDist))
        .pipe(browserSync.stream());
    console.log(' -------------------------------------------------\n|     WYGENEROWANO POMYŚLNIE PRODUKCYJNE CSS-y    |\n -------------------------------------------------');
});


//TASK DO WSTRZYKNIĘCIA LISTY JS-ow
gulp.task('js-dev-inject', function () {
    console.log('injecting ...');
    gulp.src('src/html/inc/js-dev-inject.inc')
        .pipe(inject( gulp.src([jsSrc],  {read: false}), {ignorePath: 'src/', removeTags:true, empty:true}))
        .pipe(rename({ suffix: dynamic}))
        .pipe(gulp.dest('src/html/inc/'))
        .pipe(browserSync.stream());
    console.log('injected: ' + jsSrc + ' ...' );
    gulp.src(jsSrc)        
        .pipe(gulp.dest(jsDistDev))
});
gulp.task('hint-js', function () {
    gulp.src([jsSrc])
        .pipe(gulp.dest(jsDistDev))
        .pipe(eslint()) //eslint
        .pipe(eslint.format()) //eslint
        .pipe(eslint.failAfterError()) //eslint
        .on( 'error', function () {
          gulp.fail = true;
        });
      /*.pipe(jslint({
            node: true,
            es6: false,
            white: true,
            browser: true,
            global: ['$'],
            predef: []
        }))        
        .pipe(jslint.reporter('default', false));*/
        
        console.log(' --------------------------------------------------\n|              WYGENEROWANO JS-y DO dist/          |\n --------------------------------------------------');
});



//TASK DO WSTRZYKNIĘCIA ZOPTYMALIZOWANEGO I ZACIEMNUIONEGO JS-a
gulp.task('js-inject', function () {
    gulp.src(jsSrc).pipe(concat(jsName))
            .pipe(rename({ suffix: suffix}))
            .pipe(uglify())
            .pipe(gulp.dest(jsDist))
            .pipe(gulp.dest(jsDistDev))
    gulp.src('src/html/inc/js-dev-inject.inc')            
            .pipe(inject( gulp.src([jsMinFile],  {read: false}), {ignorePath: 'dist/', removeTags:true, empty:true}))
            .pipe(rename({ suffix: dynamic}))
            .pipe(gulp.dest('src/html/inc/'))
            .pipe(browserSync.stream());
        console.log(' ..injected: ' + jsMinFile );
        console.log(' -------------------------------------------------\n|   WYGENEROWANO I WSTRZYKNIĘTO PRODUKCYJNE JS-y  |\n -------------------------------------------------');
});



//TASK DO DEVELOPMENU
gulp.task('dev', function () {
    //watch'e, sync
    runSequence('js-dev-inject', 'styles', 'images', 'html');  // usunąć hint?
    gulp.watch(cssSrc, ['styles']);
    gulp.watch(jsSrc, ['hint-js']);
    gulp.watch(HtmlSrc, ['html']);
    gulp.watch(imgSrc, ['images']);
    console.log(' --------------------------------------------------\n|                                                  |\n|      ....... GULP IS WATCHING YOU......          |\n|                                                  |\n --------------------------------------------------');    
    browserSync.init({
        server: {
            proxy: urls.url.dev,
            baseDir: 'dist/'
        }
    });
    gulp.watch(HtmlSrc).on('change', browserSync.reload);
    gulp.watch(cssSrc).on('change', browserSync.reload);    
    gulp.watch(jsSrc).on('change', browserSync.reload);
});



//TASK PRODUKCYJNY - do generowania wszystkich niezbędnych najświerzszych plikow produkcyjnych
gulp.task('prod', function () {
    runSequence('js-inject', 'styles', 'html');
});