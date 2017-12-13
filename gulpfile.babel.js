import path from 'path';
import gulp from 'gulp';
import del from 'del';
import svgSprite from 'gulp-svg-sprites';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import filter from 'gulp-filter';
import fs from 'fs';

const {
  exclude = [],
  include = []
} = require('./package.json').icons || {};

export function ico() {
  return gulp.src('src/ico/*.svg')
    .pipe(filter(function (file) {
      const fileName = path.basename(file.path, '.svg');

      if (
        (exclude.length && exclude.indexOf(fileName) !== -1) ||
        (include.length && include.indexOf(fileName) === -1)
      ) {
        return false;
      }

      return true;
    }))
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
        $('title').remove();
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: 'symbols',
      selector: 'icon-%f',
      templates: {
        symbols: fs.readFileSync(path.join(__dirname, 'src', 'symbols.svg'), 'utf-8')
      }
    }))
    .pipe(gulp.dest('dist'));
}

export function clean() {
  return del(['dist/**/*']);
}

const build = gulp.series(
  clean,
  gulp.parallel(ico)
);

export {
  build
};

export default build;
