'use strict'

const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const insert = require('gulp-file-insert');
const beautify = require('gulp-beautify');

function autoprefix() {
  return gulp
    .src('./css/theme/*.css')
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest('./css/theme'));
}

function minifyCSS() {
  return gulp
    .src('./css/optionals/*.css')
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./css/optionals/min'));
}

function userCSS() {
  return gulp
    .src('./css/usercss-template.css')
    .pipe(
      insert({
        '{{theme}}': './css/theme/theme.css',
        '{{max-width}}': './css/optionals/min/max-width.min.css',
        '{{stretch-video}}': './css/optionals/min/stretch-video.min.css',
        '{{fade-watched}}': './css/optionals/min/fade-watched.min.css',
        '{{wide-video-container}}': './css/optionals/min/wide-video-container.min.css',
        '{{fade++-compatibility}}': './css/optionals/min/fade++-compatibility.min.css',
        '{{netflix-subtitles}}': './css/optionals/min/netflix-subtitles.min.css',
        '{{remove-pockettube-subscription-filter-border}}': './css/optionals/min/remove-pockettube-subscription-filter-border.min.css',
        '{{display-full-titles-for-videos}}': './css/optionals/min/display-full-titles-for-videos.min.css',
    })
    )
    .pipe(rename('style.user.css'))
    .pipe(
      beautify.css({
        end_with_newline: true,
        indent_size: 2,
        preserve_newlines: true
      })
    )
    .pipe(gulp.dest('./'));
}

function compileSass() {
  return gulp
    .src('./sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('./css/theme'));
}

function watchSass() {
  gulp.watch('./sass/**/*.scss', gulp.series(compileSass, autoprefix, minifyCSS, userCSS));
}

gulp.task('sass:watch', watchSass);

gulp.task('default', gulp.series(watchSass));
