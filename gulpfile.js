const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

const SRC_PATH = require('path').join(__dirname, './lib/solar.js');
const DIST_PATH = require('path').join(__dirname, './lib/dist');

gulp.task('default', () => {
  gulp.src(SRC_PATH)
      .pipe(babel())
      .pipe(uglify())
      .pipe(rename('solar.min.js'))
      .pipe(gulp.dest(DIST_PATH));
});
