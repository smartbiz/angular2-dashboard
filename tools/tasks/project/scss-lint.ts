import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as reporter from 'postcss-reporter';
import * as stylelint from 'stylelint';
import * as doiuse from 'doiuse';
import * as colorguard from 'colorguard';
import {join} from 'path';
// import {APP_SRC, APP_ASSETS, BROWSER_LIST, ENV} from '../../config';
import {APP_SRC, BROWSER_LIST, ENV, DEPENDENCIES} from '../../config'; //SASS & *.scss
const plugins = <any>gulpLoadPlugins();

const isProd = ENV === 'prod';

const processors = [
  doiuse({
    browsers: BROWSER_LIST,
  }),
  colorguard(),
  stylelint(),
  reporter({clearMessages: true})
];

/**
 * @deprecated using lintComponentScss() instead of
 */
/**
function lintComponentCss() {
  return gulp.src([
      join(APP_SRC, '**', '*.css'),
      '!' + join(APP_SRC, 'assets', '**', '*.css')
    ])
    .pipe(isProd ? plugins.cached('css-lint') : plugins.util.noop())
    .pipe(plugins.postcss(processors));
}

function lintExternalCss() {
  return gulp.src(getExternalCss().map(r => r.src))
    .pipe(isProd ? plugins.cached('css-lint') : plugins.util.noop())
    .pipe(plugins.postcss(processors));
}

function getExternalCss() {
  return APP_ASSETS.filter(d => /\.css$/.test(d.src) && !d.vendor);
}
*/

/**
 * SASS & *.scss - basically you can replace everything from lintComponentCss with this code
 */
function lintComponentScss() {
  return gulp.src([
      join(APP_SRC, '**', '*.scss'),
      '!' + join(APP_SRC, 'assets', '**', '*.scss')
    ])
    .pipe(isProd ? plugins.cached('css-lint') : plugins.util.noop())
    .pipe(plugins.postcss(processors));
}

function lintExternalScss() {
  return gulp.src(getExternalScss().map(r => r.src))
    .pipe(isProd ? plugins.cached('scss-lint') : plugins.util.noop())
    .pipe(plugins.postcss(processors));
}

function getExternalScss() {
  return DEPENDENCIES.filter(d => /\.scss/.test(d.src) && !d.vendor);
}

// export = () => merge(lintComponentCss(), lintExternalCss());
export = () => merge(lintComponentScss(), lintExternalScss()); //SASS & *.scss
