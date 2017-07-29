import gulp from 'gulp';
import del from 'del';
import svgSprite from 'gulp-svg-sprites';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import fs from 'fs';

export function ico() {
  return gulp.src('src/ico/*.svg')
    .pipe(svgmin({
      // js2svg: {
      //   pretty: true
      // }
    }))
    // .pipe(cheerio({
    //   run: function ($) {
    //     $('[fill]').removeAttr('fill');
    //     $('[style]').removeAttr('style');
    //   },
    //   parserOptions: {
    //     xmlMode: true
    //   }
    // }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: 'symbols',
      selector: 'icon-%f'
    }))
    .pipe(gulp.dest('dist'));
}

export function clean() {
  return del(['dist']);
}

const build = gulp.series(
  clean,
  gulp.parallel(ico)
);

export {
  build
};

export default build;
