const SRC_DIR = `src`;
const DIST_DIR = `dist`;

const port = 33302;

const autoprefixer = require(`gulp-autoprefixer`);
const browser = require(`browser-sync`);
const gulp = require(`gulp`);
const htmlhint = require(`gulp-htmlhint`);
const notify = require(`gulp-notify`);
const plumber = require(`gulp-plumber`);
const rename = require(`gulp-rename`);
const sass = require(`gulp-sass`);
const header = require(`gulp-header`);
const cmq = require(`gulp-combine-media-queries`);
const ssi = require(`connect-ssi`);
const fs = require(`fs`);
const aigis = require(`gulp-aigis`);

//sass
gulp.task(`sass`, function() {
  return gulp.src(`${SRC_DIR}/**/*.scss`)
  .pipe(plumber({
    errorHandler: notify.onError(`sassにエラーがあります`)
  }))
  .pipe(sass({
    outputStyle: `expanded`
  }))
  .pipe(autoprefixer({
    // ☆IEは9以上、Androidは4以上、iOS Safariは8以上
    // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
    browsers: [`last 2 versions`, `ie >= 9`, `Android >= 4`,`ios_saf >= 8`],
    cascade: false
  }))
  .pipe(cmq({
    log: true
  }))
  .pipe(header('@charset "UTF-8";\n\n'))
  .pipe(gulp.dest(`./${DIST_DIR}`))
  .pipe(notify(`Sassをコンパイルしました`))
  .pipe(browser.reload({
    stream: true
  }));
});

//html-hint
gulp.task(`html-hint`, function() {
  gulp.src([`${DIST_DIR}/**/*.html`, `!${DIST_DIR}/**/ssi/**/*.html`, `!${DIST_DIR}/**/_styleguide/**/*.html`])
  .pipe(htmlhint())
  .pipe(htmlhint.reporter())
  .pipe(browser.reload({
    stream: true
  }));
});

//browser-sync
gulp.task(`server`, function() {
  browser({
    port: port,
    server: {
      baseDir: `./${DIST_DIR}/http/`,
      middleware: [
        ssi({
          baseDir: __dirname + `/${DIST_DIR}/http/`,
          ext: `.html`
        })
      ]
    }
  });
});

//aigis
gulp.task('aigis', function() {
  return gulp.src('./aigis_config.yml')
    .pipe(aigis());
});

// watch
gulp.task(`watch`, function(){
  gulp.watch(`${SRC_DIR}/**/*.scss`, [`sass`]);
  gulp.watch(`${DIST_DIR}/**/*.html`, [`html-hint`]);
});

// default
gulp.task(`default`,[`watch`, `server`,  `sass`]);
