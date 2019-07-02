'use strict'

let autoprefixer = require( 'gulp-autoprefixer' )
let beautify = require( 'gulp-beautify' )
let cleanCSS = require( 'gulp-clean-css' );
let gulp = require( 'gulp' )
let insert = require( 'gulp-file-insert' )
let rename = require( 'gulp-rename' )
let sass = require( 'gulp-sass' )

sass.compiler = require( 'node-sass' )

gulp.task( 'autoprefix', function () {
  return gulp.src( './css/theme/*.css' )
    .pipe( autoprefixer( {
      overrideBrowserslist: [
        '> 0.2%',
        'last 2 versions',
        'maintained node versions',
        'not dead'
      ],
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
      '{{fade++-compatibility}}': './css/optionals/min/fade++-compatibility.min.css'
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
