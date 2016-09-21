// UPDATE to gulp 4.0
/*
# uninstall previous Gulp installation, if any
$ npm uninstall gulp -g
$ cd [your_project_root]
$ npm uninstall gulp

# install Gulp 4 CLI tools globally from 4.0 GitHub branch
$ npm install gulpjs/gulp-cli#4.0 -g

# install Gulp 4 into your project
$ npm install gulpjs/gulp.git#4.0 --save-dev
*/


var gulp = require('gulp');
const browserSync = require('browser-sync').create();
const bsConfig = require('./bs-config.js');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
const rename = require('gulp-rename');
const less = require('gulp-less');
const path = require('path');
const uglify = require('gulp-uglify');


gulp.task('browser-sync', function() {
    return browserSync.init(bsConfig);
});

function compileLess(files) {
    return gulp.src(files)
      .pipe(less({
        paths: [
            'less/bootstrap/mixins',
            'less/bootstrap'
         ],
        plugins: [autoprefix]
      }))
      .pipe(rename(function(path) {
              path.basename += '.min'
              return path;
      }))
      .pipe(gulp.dest('css'));
}

gulp.task('less-bootstrap', () => { return compileLess(['less/bootstrap/bootstrap.less']);});

gulp.task('less', () => { return compileLess(['less/*.less']);});

gulp.task('less:watch', function() {
    return gulp.watch('less/*.less', gulp.task('less'))
    .on('change', function(event) {
        console.log('File ' + path.basename(event) + ' was changed! Running tasks...');
    });
});

gulp.task('js', () => {
    return gulp.src([
        'js/page.js'
    ])
    .pipe(uglify({
        preserveComments: 'license',
        mangle: true
    }))
    .pipe(rename(function(path) {
        path.basename += '.min'
        return path;
    }))
    .pipe(gulp.dest('js'));
});

gulp.task('js:watch', function() {
    gulp.watch(['js/page.js'], gulp.task('js'))
    .on('change', function(event) {
        console.log('File ' + path.basename(event) + ' was changed! Running tasks...');
    });
});


gulp.task('build', gulp.series('less-bootstrap', 'less', 'js'));

gulp.task('default', gulp.parallel('browser-sync', 'less:watch', 'js:watch'));
