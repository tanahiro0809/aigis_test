const browserVersion = [
  'Android >= 4.4',
  'Chrome >= 57',
  'ChromeAndroid >= 57',
  'Edge >= 14',
  'Firefox >= 52',
  'ie 11',
  'iOS >= 9',
  'Safari >= 9'
];

const port = {};
port.http = 33556;
port.https = 43556;

// 以降は触らない

const SRC_DIR = `src`;
const DIST_DIR = `dist`;

const autoprefixer = require(`gulp-autoprefixer`);
const connectSSI = require(`connect-ssi`);
const gulp = require(`gulp`);
const htmlhint = require(`gulp-htmlhint`);
const notify = require(`gulp-notify`);
const plumber = require(`gulp-plumber`);
const sass = require(`gulp-sass`);
const header = require(`gulp-header`);
const webserver = require(`gulp-webserver`);
const fs = require(`fs`);

//sass
gulp.task(`sass`, function() {
  return gulp.src(`${SRC_DIR}/**/*.scss`)
  .pipe(plumber({
    errorHandler: notify.onError(`sassにエラーがあります`)
  }))
  .pipe(sass({
    outputStyle: `compact`
  }))
  .pipe(autoprefixer({
    browsers: browserVersion,
    cascade: false
  }))
  .pipe(header('@charset "UTF-8";\n\n'))
  .pipe(gulp.dest(`./${DIST_DIR}`))
  .pipe(notify(`Sassをコンパイルしました`));
});

//html-hint
gulp.task(`html-hint`, function() {
  gulp.src([`${DIST_DIR}/**/*.html`, `!${DIST_DIR}/**/ssi/**/*.html`])
  .pipe(htmlhint())
  .pipe(htmlhint.reporter());
});

// server
gulp.task(`server`, function() {
  gulp.src(`${DIST_DIR}/http`)
    .pipe(webserver({
      host: `localhost`,
      port: port.http,
      middleware: [
        connectSSI({
          baseDir: `${DIST_DIR}/http`,
          ext: `.html`
        })
      ]
    }));

  gulp.src(`${DIST_DIR}/https`)
    .pipe(webserver({
      host: `localhost`,
      port: port.https,
      middleware: [
        connectSSI({
          baseDir: `${DIST_DIR}/https`,
          ext: `.html`
        })
      ]
    }));
});

// watch
gulp.task(`watch`, function(){
  gulp.watch(`${SRC_DIR}/**/*.scss`, [`sass`]);
  gulp.watch(`${DIST_DIR}/**/*.html`, [`html-hint`]);
});


// default
gulp.task(`default`,[`watch`, `server`]);
