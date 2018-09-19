let gulp = require('gulp')
let pug = require('gulp-pug')
let sass = require('gulp-sass')

gulp.task('build-pug', (done) => {
    return gulp.src('../demoapp/src/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('../demoapp/src'))
})

gulp.task('bootstrap', (done) => {
    return gulp.src('../demoapp/node_modules/bootstrap/scss/bootstrap.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('../demoapp/node_modules/bootstrap/dist/css/bootstrap.min.css'));
})

gulp.task('watch', () => {
    gulp.watch('../demoapp/src/**/*.pug', ['build-pug'])
})

gulp.task('default', ['build-pug', 'watch']);