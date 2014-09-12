var
  fs = require('fs'),
  gulp = require('gulp'),
  watch = require('gulp-watch'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  // gulpkss = require('gulp-kss'),
  usemin = require('gulp-usemin'),
  imagemin = require('gulp-imagemin'),
  minify = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  changed = require('gulp-changed'),
  bsync = require('browser-sync');

var paths = {
  dev: './',
  pages: '*.html',
  jade: 'assets/jade/*.jade',
  glob_jade: 'assets/jade/**/*.jade',
  js: 'assets/js/*.js',
  scss: 'assets/scss/*.scss',
  glob_scss: 'assets/scss/**/*.scss',
  css: 'assets/css',
  // kss: 'assets/kss/*.html',
  // kss_css: 'assets/scss/kss.scss',
  img: 'assets/images/*',
  data: 'assets/data/dummy.json',
  dist: 'public',
  dist_css: 'public/assets/css',
  dist_img: 'public/assets/images'
};

gulp.task('styles', function () {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(changed(paths.css, {extension: '.css'}))
    .pipe(sass({
      errLogToConsole: true,
      includePaths: require('node-neat').with('./bower_components/', '../chj_framework/')
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(bsync.reload({stream:true}));
});

gulp.task('templates', function() {
  return gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(changed(paths.dev, {extension: '.html'}))
    .pipe(jade({
      pretty: true,
      locals: JSON.parse(fs.readFileSync(paths.data, 'utf8'))
    }))
    .pipe(gulp.dest(paths.dev));
});

// gulp.task('kss', function() {
//   gulp.src(paths.glob_scss)
//     .pipe(gulpkss({
//       overview: 'assets/kss/styleguide.md',
//       templateDirectory: 'assets/kss/'
//     }))
//     .pipe(gulp.dest('public/styleguide'));
//   gulp.src(paths.kss_css)
//     .pipe(sass({
//       errLogToConsole: true,
//       includePaths: require('node-neat').with('./bower_components/', '../chj_framework/')
//     }))
//     .pipe(minify())
//     .pipe(rename('kss-min.css'))
//     .pipe(gulp.dest(paths.dist_css));
// });

gulp.task('build', function() {
  gulp.src(paths.pages)
    .pipe(usemin({
      js: [uglify()],
      css: [minify()]
    }))
    .pipe(gulp.dest(paths.dist));
  gulp.src(paths.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(paths.dist_img));
});

gulp.task('build--fast', function() {
  gulp.src(paths.pages)
    .pipe(usemin({
      js: [uglify()],
      css: [minify()]
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('server', function() {
  bsync({
    server: {
      baseDir: paths.dev,
      online: false,
      tunnel: false
    }
  });
});

gulp.task('scan', function () {
  watch(paths.glob_scss, function() {
    gulp.start('styles');
  });
  watch(paths.glob_jade, function() {
    gulp.start('templates');
  });
  watch(paths.data, function() {
    gulp.start('templates');
  });
  watch(paths.pages, function() {
    bsync.reload();
  });
  watch(paths.js, function() {
    bsync.reload();
  });
  // watch(paths.kss, function() {
  //   gulp.start('kss');
  // });
})
gulp.task('compile', ['styles', 'templates']);
gulp.task('default', ['compile', 'server', 'scan']);