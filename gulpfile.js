let gulp = require('gulp');
let sass = require('gulp-sass');
let babel = require('gulp-babel');

// compile sass
gulp.task('sass', function () {
    return gulp.src('css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

// compile 
gulp.task('es6', function() {
    return gulp.src('js/**/*.js')
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(gulp.dest('./build/'));
})

// watch for sass/ES6 updates
gulp.task('default', function() {
    gulp.watch('css/**/*.scss', gulp.series('sass'));
    gulp.watch('js/**/*.js', gulp.series('es6'));
});