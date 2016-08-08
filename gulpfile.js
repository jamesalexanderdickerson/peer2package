var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  minify = require('gulp-minify'),
  coffee = require('gulp-coffee'),
  autoprefixer = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  del = require('del'),
  browserSync = require('browser-sync').create();
gulp.task('default', ['clean'], function () {
  gulp.start('styles', 'markup', 'scripts', 'images', 'watch', 'serve');
});
gulp.task('serve', function () {
  browserSync.init({
    server: './public'
  });
  gulp.watch('public/stylesheets/*.css').on('change', browserSync.reload);
  gulp.watch('public/js/*.js').on('change', browserSync.reload);
  gulp.watch('public/*.html').on('change', browserSync.reload);
});
gulp.task('watch', function () {
  gulp.watch('src/js/*.coffee', ['scripts']);
  gulp.watch('src/views/*.jade', ['markup']);
  gulp.watch('src/stylesheets/*.styl', ['styles']);
  gulp.watch('src/images/*', ['images']);
});
gulp.task('markup', function () {
  gulp.src('src/views/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('public'))
  .pipe(browserSync.stream());
});
gulp.task('styles', function () {
  gulp.src('src/stylesheets/*.styl')
  .pipe(stylus())
  .pipe(autoprefixer())
  .pipe(gulp.dest('public/stylesheets'))
  .pipe(browserSync.stream());
});
gulp.task('scripts', function () {
  gulp.src('src/js/*.coffee')
  .pipe(coffee())
  .pipe(minify())
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.stream());
});
gulp.task('images', function () {
  gulp.src('src/images/*')
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
  .pipe(gulp.dest('public/images'))
  .pipe(browserSync.stream());
});
gulp.task('clean', function () {
return del(['public/index.html','public/map.html','public/stylesheets/main.css','public/js/main-min.js', 'public/js/main.js', 'public/js/map-min.js', 'public/js/map.js'])
});
