var gulp = require('gulp'),
    concat = require('gulp-concat'),
    markdown = require('gulp-markdown'),
    clean = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    less = require('gulp-less');

var config = require('./config.json'),
    tConfig = require('./templates/' + config.template + '/config.json');

/**
 * Fix the file paths;
 */
for(var i=0; i<tConfig.javascript.length; i++) {
    tConfig.javascript[i] = './templates/' + config.template + '/' + tConfig.javascript[i];
}

for(var i=0; i<tConfig.less.length; i++) {
    tConfig.less[i] = './templates/' + config.template + '/' + tConfig.less[i];
}
for(var i=0; i<tConfig.header.length; i++) {
    tConfig.header[i] = './templates/' + config.template + '/' + tConfig.header[i];
}
for(var i=0; i<tConfig.footer.length; i++) {
    tConfig.footer[i] = './templates/' + config.template + '/' + tConfig.footer[i];
}



gulp.task('clean-up', function() {
    gulp.src('./tmp')
        .pipe(clean());
});

gulp.task('compile-markdown', function() {
    for(keys in config.pages) {
        gulp.src('./content/' + config.pages[keys])
            .pipe(markdown())
            .pipe(rename(keys))
            .pipe(gulp.dest('./tmp'));
    }
});


gulp.task('template-scripts', function() {
   gulp.src(tConfig.javascript)
       .pipe(concat('bundle.js'))
       .pipe(gulp.dest('./www/js/'));
});


gulp.task('template-less', function() {
   gulp.src(tConfig.less)
       .pipe(less())
       .pipe(concat('bundle.css'))
       .pipe(gulp.dest('./www/css/'));
});


gulp.task('build', function() {
    gulp.src(tConfig.header)
        .pipe(concat('tmp-header.html'))
        .pipe(gulp.dest('./tmp/'));
    gulp.src(tConfig.footer)
        .pipe(concat('tmp-footer.html'))
        .pipe(gulp.dest('./tmp/'));
});

gulp.task('compile-build', function() {
    for(key in config.pages) {
        gulp.src([
            './tmp/tmp-header.html',
            './tmp/' + key,
            './tmp/tmp-footer.html'
        ])
            .pipe(concat(key))
            .pipe(gulp.dest('./www/'));
    }
});






gulp.task('default',[
    'template-scripts',
    'template-less',
    'compile-markdown',
    'build',
    'compile-build',
    'clean-up'
]);







