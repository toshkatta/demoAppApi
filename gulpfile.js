let gulp = require('gulp')
let pug = require('gulp-pug')

gulp.task('build-pug', (done) => {
    return gulp.src('../demoapp/src/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('../demoapp/src'))
})

gulp.task('watch', () => {
    gulp.watch('../demoapp/src/**/*.pug', ['build-pug'])
})

gulp.task('default', ['build-pug', 'watch']);