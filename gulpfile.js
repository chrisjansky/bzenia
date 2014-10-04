var
  fs = require("fs"),
  argv = require("yargs").argv,
  glob = require("glob"),
  gulp = require("gulp"),
  sass = require("gulp-sass"),
  jade = require("gulp-jade"),
  clean = require("gulp-clean"),
  rename = require("gulp-rename"),
  plumber = require("gulp-plumber"),
  size = require("gulp-size"),
  watch = require("gulp-watch"),
  usemin = require("gulp-usemin"),
  imagemin = require("gulp-imagemin"),
  minify = require("gulp-minify-css"),
  uglify = require("gulp-uglify"),
  uncss = require("gulp-uncss"),
  svgsprite = require("gulp-svg-sprites"),
  svgpng = require("gulp-svg2png"),
  // gulpkss = require("gulp-kss"),
  bsync = require("browser-sync");

var paths = {
  development: "./",
  pages: "*.html",
  jade: "assets/jade/*.jade",
  glob_jade: "assets/jade/**/*.jade",
  js: "assets/js/*.js",
  scss: "assets/scss/*.scss",
  css: "assets/css",
  glob_scss: "assets/scss/**/*.scss",
  glob_css: "assets/css/*.css",
  images: "assets/images",
  fallbacks: "assets/images/fallbacks",
  svg: "assets/svg",
  glob_images: "assets/images/**/*",
  glob_svg: "assets/svg/source/*",
  ignore_images: "!assets/images/ignore{,/**}",
  data: "assets/data/dummy.json",
  // kss: "assets/kss/*.html",
  // kss_css: "assets/scss/kss.scss",
  production: "public/",
};

// Declare files to move to public/ during "build" task.
var productionFiles = [
  "assets/fonts/*",
  "favicon.ico"
]

gulp.task("styles", function () {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: require("node-neat").with("bower_components/")
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(bsync.reload({stream: true}));
});

gulp.task("pages", ["templates"], function() {
  bsync.reload();
});

gulp.task("templates", function() {
  return gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true,
      locals: JSON.parse(fs.readFileSync(paths.data, "utf8"))
    }))
    .pipe(gulp.dest(paths.development));
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
//     .pipe(gulp.dest(paths.production + paths.css));
// });

// Combine all SVG assets into one.
gulp.task("combine-svg", ["wipe-fallbacks"], function() {
  return gulp.src(paths.glob_svg)
    .pipe(svgsprite({
      mode: "symbols",
      // svgId: "svg-%f",
      // preview: false,
      svg: {
        symbols: "complete.svg"
      },
      preview: {
        symbols: "index.html"
      }
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.svg));
})

// Delete the assets/fallbacks/ folder.
gulp.task("wipe-fallbacks", function() {
  return gulp.src(paths.fallbacks, {read: false})
    .pipe(clean());
})

// SVG automation task.
gulp.task("svg", ["combine-svg"], function() {
  return gulp.src(paths.glob_svg)
    .pipe(svgpng())
    .pipe(gulp.dest(paths.fallbacks));
});

// Minify CSS and JS.
gulp.task("produce", ["wipe"], function() {
  return gulp.src(paths.pages)
    .pipe(plumber())
    .pipe(usemin({
      js: [uglify()],
      css: [
        minify({
          keepSpecialComments: 0
        })]
    }))
    .pipe(gulp.dest(paths.production));
});

// Move other assets to production folder.
gulp.task("move", ["wipe"], function() {
  gulp.src(productionFiles, {base: paths.development})
    .pipe(gulp.dest(paths.production));
});

// Delete the previous build.
gulp.task("wipe", function() {
  if (argv.full) {
    return gulp.src(paths.production, {read: false})
      .pipe(clean());
  } else return;
});

// Minify images if provided with --full argument.
gulp.task("images", ["wipe"], function() {
  if (argv.full) {
    return gulp.src([paths.glob_images, paths.ignore_images])
      .pipe(plumber())
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest(paths.production + paths.images));
  };
});

// Wait for "produce" and strip unused CSS afterwards if --uncss provided.
gulp.task("strip", ["produce"], function() {
  if (argv.uncss) {
    return gulp.src(paths.production + paths.glob_css)
      .pipe(plumber())
      .pipe(uncss({
        html: glob.sync(paths.pages),
        ignore: [/::?-[\w\d]+/]
      }))
      .pipe(minify())
      .pipe(size({
        showFiles: true
      }))
      .pipe(gulp.dest(paths.production + paths.css));
  }
});

// Wait for "compile" before starting up server.
gulp.task("server", ["compile"], function() {
  bsync({
    server: {
      baseDir: paths.development
    },
    online: true,
    tunnel: false,
    xip: true,
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
    gulp.start("pages");
  });
  watch(paths.data, function() {
    gulp.start("pages");
  });
  watch(paths.js, function() {
    bsync.reload();
  });
  // watch(paths.kss, ["kss"]);
});

// Wipe first. Move, produce, images. Strip after produce.
gulp.task("build", ["move", "images", "strip"]);
gulp.task("compile", ["styles", "pages"]);
gulp.task("default", ["compile", "server", "scan"]);