var gulp = require("gulp");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task("watch", watch);
gulp.task('compress', compress);

function watch() {
    return gulp.watch('app/scripts/*.js', ['compress']);
}

function compress() {
    return gulp.src(['app/scripts/main.js', 'app/scripts/*.js'])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('dist'));
}