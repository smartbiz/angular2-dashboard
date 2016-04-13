import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as autoprefixer from 'autoprefixer';
import * as cssnano from 'cssnano';
import {join} from 'path';
import {DEPENDENCIES, APP_SRC, TMP_DIR, CSS_DEST, APP_DEST, BROWSER_LIST, ENV} from '../../config';
const plugins = <any>gulpLoadPlugins();

const processors = [
  autoprefixer({
    browsers: BROWSER_LIST
  })
];

const isProd = ENV === 'prod';

if (isProd) {
  processors.push(
    cssnano({
      discardComments: {removeAll: true}
    })
  );
}

function prepareTemplates() {
  return gulp.src(join(APP_SRC, '**', '*.html'))
    .pipe(gulp.dest(TMP_DIR));
}

/**
 * @deprecated using processComponentScss instead of
 */
/**
function processComponentCss() {
  return gulp.src([
      join(APP_SRC, '**', '*.css'),
      '!' + join(APP_SRC, 'assets', '**', '*.css')
    ])
    .pipe(isProd ? plugins.cached('process-component-css') : plugins.util.noop())
    .pipe(plugins.postcss(processors))
    .pipe(gulp.dest(isProd ? TMP_DIR: APP_DEST));
}

function processExternalCss() {
  return gulp.src(getExternalCss().map(r => r.src))
    .pipe(isProd ? plugins.cached('process-external-css') : plugins.util.noop())
    .pipe(plugins.postcss(processors))
    .pipe(isProd ? plugins.concat(CSS_PROD_BUNDLE) : plugins.util.noop())
    .pipe(gulp.dest(CSS_DEST));
}

function getExternalCss() {
  return DEPENDENCIES.filter(d => /\.css$/.test(d.src));
}
*/

/**
 * SASS & *.scss - basically we can overwrite everything from processComponentCss with the contents below
 */
function processComponentScss() {
  return gulp.src([
      join(APP_SRC, '**', '*.scss'),
      '!' + join(APP_SRC, 'assets', '**', '*.scss')
    ])
    .pipe(isProd ? plugins.cached('process-component-scss') : plugins.util.noop())
    .pipe(isProd ? plugins.progeny() : plugins.util.noop())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({includePaths: ['./node_modules/']}).on('error', plugins.sass.logError))
    .pipe(plugins.postcss(processors))
    .pipe(plugins.sourcemaps.write(isProd ? '.' : ''))
    .pipe(gulp.dest(isProd ? TMP_DIR: APP_DEST));
}

function processExternalScss() {
  return gulp.src(getExternalScss().map(r => r.src))
    .pipe(isProd ? plugins.cached('process-external-scss') : plugins.util.noop())
    .pipe(isProd ? plugins.progeny() : plugins.util.noop())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({includePaths: ['./node_modules/']}).on('error', plugins.sass.logError))
    .pipe(plugins.postcss(processors))
    .pipe(plugins.sourcemaps.write(isProd ? '.' : ''))
    .pipe(gulp.dest(CSS_DEST));
}

function getExternalScss() {
  return DEPENDENCIES.filter(d => /\.scss$/.test(d.src));
}

// export = () => merge(processComponentCss(), prepareTemplates(), processExternalCss());
export = () => merge(processComponentScss(), prepareTemplates(), processExternalScss());
