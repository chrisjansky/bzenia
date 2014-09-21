var
  fs = require("fs"),
  argv = require("yargs").argv,
  glob = require("glob"),
  gulp = require("gulp"),
  watch = require("gulp-watch"),
  sass = require("gulp-sass"),
  jade = require("gulp-jade"),
  // gulpkss = require("gulp-kss"),
  usemin = require("gulp-usemin"),
  imagemin = require("gulp-imagemin"),
  minify = require("gulp-minify-css"),
  uglify = require("gulp-uglify"),
  uncss = require("gulp-uncss"),
  rename = require("gulp-rename"),
  plumber = require("gulp-plumber"),
  bsync = require("browser-sync");

var paths = {
  dev: ".",
  pages: "*.html",
  jade: "assets/jade/*.jade",
  glob_jade: "assets/jade/**/*.jade",
  js: "assets/js/*.js",
  scss: "assets/scss/*.scss",
  glob_scss: "assets/scss/**/*.scss",
  css: "assets/css",
  // kss: "assets/kss/*.html",
  // kss_css: "assets/scss/kss.scss",
  img: "assets/images/*",
  data: "assets/data/dummy.json",
  dist: "public",
  dist_css: "public/assets/css",
  dist_glob_css: "public/assets/css/*.css",
  dist_img: "public/assets/images"
};

gulp.task("styles", function () {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: require("node-neat").with("bower_components/")
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(bsync.reload({stream:true}));
});

gulp.task("templates", function() {
  return gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true,
      locals: JSON.parse(fs.readFileSync(paths.data, "utf8"))
    }))
    .pipe(gulp.dest(paths.dev));
});

// gulp.task("kss", function() {
//   gulp.src(paths.glob_scss)
//     .pipe(gulpkss({
//       overview: "assets/kss/styleguide.md",
//       templateDirectory: "assets/kss/"
//     }))
//     .pipe(gulp.dest("public/styleguide"));
//   gulp.src(paths.kss_css)
//     .pipe(sass({
//       errLogToConsole: true,
//       includePaths: require("node-neat").with("bower_components/")
//     }))
//     .pipe(minify())
//     .pipe(rename("kss-min.css"))
//     .pipe(gulp.dest(paths.dist_css));
// });

gulp.task("produce", function() {
  // Minify CSS and JS.
  return gulp.src(paths.pages)
    .pipe(plumber())
    .pipe(usemin({
      js: [uglify()],
      css: [
        minify({
          keepSpecialComments: 0
        })]
    }))
    .pipe(gulp.dest(paths.dist));
  // Minify images if provided with --full argument.
  if (argv.full) {
    gulp.src(paths.img)
      .pipe(plumber())
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest(paths.dist_img));
  };
});

// Wait for produce task and strip unused CSS afterwards if --uncss provided.
gulp.task("strip", ["produce"], function() {
  if (argv.uncss) {
    return gulp.src(paths.dist_glob_css)
      .pipe(plumber())
      .pipe(uncss({
        html: glob.sync(paths.pages)
      }))
      .pipe(gulp.dest(paths.dist_css));
  }
});

// Wait for compile before starting up server.
gulp.task("server", ["compile"], function() {
  bsync({
    server: {
      baseDir: paths.dev
    },
    online: false,
    tunnel: false,
    xip: false,
    minify: true,
    notify: false
  });
});

gulp.task("scan", function () {
  // Traditional watch not working.
  // gulp.watch(paths.glob_scss, ["styles"]);
  // gulp.watch(paths.glob_jade, ["templates"]);
  // gulp.watch(paths.data, ["templates"]);

  // Using gulp.start, soon to be deprecated
  watch(paths.glob_scss, function() {
    gulp.start("styles");  
  });
  watch(paths.glob_jade, function() {
    gulp.start("templates");  
  });
  watch(paths.data, function() {
    gulp.start("templates");  
  });
  watch(paths.pages, function() {
    bsync.reload();
  });
  watch(paths.js, function() {
    bsync.reload();
  });
  // watch(paths.kss, ["kss"]);
});

gulp.task("build", ["produce", "strip"]);
gulp.task("compile", ["styles", "templates"]);
gulp.task("default", ["compile", "server", "scan"]);