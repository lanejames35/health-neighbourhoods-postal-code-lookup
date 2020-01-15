const { series, src, dest, watch } = require('gulp');
const { reload, init } = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');
const clean =require('gulp-clean');
const imagemin = require('gulp-imagemin');

// Styles
function styles() {
    return src(['app/styles/**.css', 'app/lib/styles/*.css'])
        .pipe(autoprefixer('last 1 version'))
        .pipe(csso())
        .pipe(dest('dist/styles'))
        .pipe(size());
}
exports.styles = styles;

// Scripts
function scripts() {
    return src(['app/scripts/**/*.js', 'app/lib/scripts/*.js'])
        .pipe(babel({ ignore: ["app/lib/scripts/leaflet.js"] }))
        .pipe(uglify())
        .pipe(dest('dist/scripts'))
        .pipe(size());
}
exports.scripts = scripts;

// HTML
function html(){
    return src('app/index.html')
            .pipe(dest('dist'));
}
exports.html = html;

// Images
// use gulp-imagemin if necessary
function images() {
    return src(['app/images/**/*', 'app/lib/images/*'])
        .pipe(imagemin())
        .pipe(dest('dist/styles/images'))
        .pipe(size());
}
exports.images = images;

// Clean
function wipe() {
    return src(['dist'], { read: false }).pipe(clean());
}
exports.wipe = wipe;
// Server
function regen(done){
    reload();
    done();
}
function serve(done){
    init({
        server: {
            baseDir: "dist",
            index: "index.html"
        },
        port: 9000,
        open: false
    })
    done();
}


function watchTask(done) {
    // Watch .html files
    watch('app/*.html', series(html, regen));
    // Watch .css files
    watch('app/styles/**/*.css', series(styles, regen));
    // Watch .js files
    watch('app/scripts/**/*.js', series(scripts, regen));
    // Watch image files
    watch('app/images/**/*', series(images, regen));
    done();
}

// Build
//exports.build = series(html, images);

// Default task
//exports.default = series(html, images, clean);

// Watch
exports.default = series(styles, scripts, images, html, watchTask, serve);
