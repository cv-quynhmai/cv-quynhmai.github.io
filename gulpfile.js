const { src, dest, parallel, watch } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const minifyCSS = require("gulp-csso");
const concat = require("gulp-concat");
const livereload = require("gulp-livereload");
const autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');

// Static Server + watching scss/html files
function html() {
  watch("*.html").on("change", browserSync.reload);
  // You can use a single task
  watch("build/**/**/*", css).on("change", browserSync.reload);
  watch("build/js/*.js", js).on("change", browserSync.reload);
}
/**
 * load init server 
 */
function serve() {
  return browserSync.init({
    server: {
      baseDir: "./"
    }
  });
}

function css() {
  return src("build/*.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(dest("assets/css"))
    .pipe(livereload());
}

function js() {
  return src("build/js/*.js", { sourcemaps: true })
  .pipe(uglify())
  .pipe(concat("all.min.js"))
  .pipe(dest("assets/js", { sourcemaps: true }));
}

function cleanCSS(){
  return gulp.src('assets/css/*.css')
  .pipe(sourcemaps.init())
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist'));
}
exports.js = js;
exports.css = css;
exports.html = html;
exports.serve = serve;
exports.default = parallel(css, js, html, serve);