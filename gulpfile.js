'use strict';
// Generated on 2020-01-09 using generator-leaflet 0.0.17

const { series, src, dest, watch } = require('gulp');
const open = require('open');

// Load plugins
const $ = require('gulp-load-plugins')();

// Styles
function styles() {
    return src(['app/styles/main.css'])
        .pipe($.autoprefixer('last 1 version'))
        .pipe(dest('app/styles'))
        .pipe($.size());
};

// Scripts
function scripts() {
    return src(['app/scripts/**/*.js'])
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.size());
};

// HTML
function html() {
    const jsFilter = $.filter('**/*.js');
    const cssFilter = $.filter('**/*.css');

    return src('app/*.html')
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(dest('dist'))
        .pipe($.size());
};

// Images
function images() {
    return src([
    		'app/images/**/*',
    		'app/lib/images/*'])
        .pipe(dest('dist/images'))
        .pipe($.size());
};

// Clean
function clean() {
    return src(['dist/styles', 'dist/scripts', 'dist/images'], { read: false }).pipe($.clean());
};

// Connect
function connect(){
    $.connect.server({
        root: 'app',
        port: 9000,
        livereload: true
    });
};

// Open
function serve() {
  open("http://localhost:9000");
};

function watchTask() {
    // Watch for changes in `app` folder
    watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], function (event) {
        return src(event.path)
            .pipe($.connect.reload());
    });

    // Watch .css files
    watch('app/styles/**/*.css', styles);

    // Watch .js files
    watch('app/scripts/**/*.js', scripts);

    // Watch image files
    watch('app/images/**/*', images);
};

// Build
exports.build = series(html, images);

// Default task
exports.default = series(html, images, clean);

// Watch
exports.watch = series(connect, serve, watchTask);
