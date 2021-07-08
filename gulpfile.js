'use strict'

const autoprefixer = require( 'gulp-autoprefixer' )
const beautify = require( 'gulp-beautify' )
const cleanCSS = require( 'gulp-clean-css' );
const gulp = require( 'gulp' )
const insert = require( 'gulp-file-insert' )
const rename = require( 'gulp-rename' )
const sass = require( 'gulp-dart-sass' )

gulp.task( 'autoprefix', function () {
  return gulp.src( './css/theme/*.css' )
    .pipe( autoprefixer( {
      cascade: false
    } ) )
    .pipe( gulp.dest( './css/theme' ) )
} )

gulp.task( 'minify-css', function () {
  return gulp.src( './css/optionals/*.css' )
    .pipe( cleanCSS() )
    .pipe( rename( {
      suffix: '.min'
    } ) )
    .pipe( gulp.dest( './css/optionals/min' ) )
} );

gulp.task( 'usercss', function () {
  return gulp.src( './css/usercss-template.css' )
    .pipe( insert( {
      '{{theme}}': './css/theme/theme.css',
      '{{max-width}}': './css/optionals/min/max-width.min.css',
      '{{stretch-video}}': './css/optionals/min/stretch-video.min.css',
      '{{fade-watched}}': './css/optionals/min/fade-watched.min.css',
      '{{wide-video-container}}': './css/optionals/min/wide-video-container.min.css',
      '{{fade++-compatibility}}': './css/optionals/min/fade++-compatibility.min.css',
      '{{netflix-subtitles}}': './css/optionals/min/netflix-subtitles.min.css'
    } ) )
    .pipe( rename( 'style.user.css' ) )
    .pipe( beautify.css( {
      end_with_newline: true,
      indent_size: 2,
      preserve_newlines: true
    } ) )
    .pipe( gulp.dest( './' ) )
} )

gulp.task( 'sass', function () {
  return gulp.src( './sass/**/*.scss' )
    .pipe( sass( {
      outputStyle: 'expanded'
    } ).on( 'error', sass.logError ) )
    .pipe( gulp.dest( './css/theme' ) )
} )

gulp.task( 'sass:watch', function () {
  gulp.watch( './sass/**/*.scss', gulp.series( 'sass', 'autoprefix', 'minify-css', 'usercss' ) )
} )

gulp.task( 'default', gulp.series( 'sass:watch' ) )
