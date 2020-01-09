'use strict';

const { series, src, dest, watch } = require('gulp');
const open = require('open');
const browserSync = require('browser-sync');
// Load plugins
const $ = require('gulp-load-plugins')();

// Styles
function styles() {
    return src(['app/styles/main.css'])
        .pipe($.autoprefixer('last 1 version'))
        .pipe(dest('app/styles'))
        .pipe($.size());
};
exports.styles = styles;

// Scripts
function scripts() {
    return src(['app/scripts/**/*.js'])
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.size());
};
exports.scripts = scripts;

// HTML

// Images
// use gulp-imagemin if necessary
function images() {
    return src([
    		'app/images/**/*',
    		'app/lib/images/*'])
        .pipe(dest('dist/images'))
        .pipe($.size());
};
exports.images = images;

// Clean
function clean() {
    return src(['dist/styles', 'dist/scripts', 'dist/images'], { read: false }).pipe($.clean());
};
exports.clean = clean;

// Server
function reload(done){
    browserSync.reload();
    done();
}
function serve(done){
    browserSync.init({
        server: {
            baseDir: "app",
            index: "index.html"
        },
        port: 9000,
        open: false
    })
    done();
}


function watchTask(done) {
    // Watch .html files
    watch('app/*.html', reload);
    // Watch .css files
    watch('app/styles/**/*.css', series(styles, reload));
    // Watch .js files
    watch('app/scripts/**/*.js', series(scripts, reload));
    // Watch image files
    watch('app/images/**/*', series(images, reload));
    done();
};

// Build
//exports.build = series(html, images);

// Default task
//exports.default = series(html, images, clean);

// Watch
exports.watch = series(watchTask, serve);


