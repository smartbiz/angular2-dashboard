import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import {join} from 'path';
import * as slash from 'slash';
import {APP_SRC, APP_DEST, APP_BASE, DEPENDENCIES, CSS_DEST, ASSETS_SRC} from '../../config';
import {templateLocals} from '../../utils';
const plugins = <any>gulpLoadPlugins();

export = () => {
  return gulp.src(join(APP_SRC, 'index.html'))
    .pipe(inject('shims'))
    .pipe(inject('libs'))
    .pipe(inject())
    .pipe(plugins.template(templateLocals()))
    .pipe(gulp.dest(APP_DEST));
};


function inject(name?: string) {
  return plugins.inject(gulp.src(getInjectablesDependenciesRef(name), { read: false }), {
    name,
    transform: transformPath()
  });
}

function getInjectablesDependenciesRef(name?: string) {
  return DEPENDENCIES
    .filter(dep => dep['inject'] && dep['inject'] === (name || true))
    .map(mapPath);
}

function mapPath(dep: any) {
  let envPath = dep.src;

  /**
   * SASS & *.scss
   */
  if (envPath.startsWith(APP_SRC) && !envPath.endsWith('.scss')) {
    envPath = join(APP_DEST, dep.src.replace(APP_SRC, ''));
  }
  if (envPath.startsWith(APP_SRC) && envPath.endsWith('.scss')) {
    envPath = envPath
      .replace(ASSETS_SRC, CSS_DEST)
      .replace('.scss', '.css');
  }

  return envPath;
}

function transformPath() {
  return function (filepath: string) {
    arguments[0] = join(APP_BASE, filepath) + `?${Date.now()}`;
    return slash(plugins.inject.transform.apply(plugins.inject.transform, arguments));
  };
}
