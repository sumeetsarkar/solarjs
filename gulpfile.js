const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

const SRC_PATH = require('path').join(__dirname, './lib/solar.js');
const DIST_PATH = require('path').join(__dirname, './lib/dist');

gulp.task('dist', () => {
    gulp.src(SRC_PATH)
        .pipe(minify({
            ext: {
                min:'.min.js'
            },
            noSource: true
        }))
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_PATH))
})