// https://www.labnol.org/code/bundle-react-app-single-file-200514
const gulp = require('gulp');
const inlinesource = require('gulp-inline-source');
const replace = require('gulp-replace');
var rename = require('gulp-rename');

gulp.task('default', () => {
  return gulp
    .src('./example/index-template.html')
    .pipe(replace(".js'></script>", ".js' inline></script>"))
    .pipe(replace('.js"></script>', '.js" inline></script>'))
    .pipe(replace('<script defer ', '<script '))
    .pipe(replace('.css">', '.css" inline>'))
    .pipe(replace(".css'>", ".css' inline>"))
    .pipe(
      inlinesource({
        compress: true,
      })
    )
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./example'));
});
