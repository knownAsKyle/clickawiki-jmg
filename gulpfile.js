var gulp = require("gulp");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var tap = require('gulp-tap');

gulp.task("watch", watch);
gulp.task('compress', compress);
gulp.task('moveHtml', moveHtml);

var folders = ["modules", "constants", "factories", "controllers", "directives", "filters"];
var watchGroupJS = formatWatchGroup(folders, "app/scripts/", "/*js");

function formatWatchGroup(list, pathConst, extension) {
    if (list && Array.isArray(list)) {
        pathConst = pathConst || "";
        extension = extension || "";
        var newArr = [];
        for (var item in list) {
            newArr.push(pathConst + list[item] + extension);
        }
        return newArr;
    }
    return [];
}

function watch() {
    gulp.watch(watchGroupJS, ['compress']);
    gulp.watch("app/scripts/directives/*.html", ['moveHtml']);
}

function compress() {
    return gulp.src(watchGroupJS)
        .pipe(concat('script.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('dist'));
}

function moveHtml() {
    var count = 0;
    var changedHtml = [];
    return gulp.src("app/scripts/directives/*.html")
        .pipe(gulp.dest('assets/templates'))
        .pipe(tap(function(file) {
            gulp.src("app/scripts/directives/" + getExtension(file.path))
                .pipe(htmlmin({
                    collapseWhitespace: true
                }))
                .pipe(concat(getExtension(file.path) + ".min.txt"))
                .pipe(gulp.dest('app/scripts/directives'));
        }));
}

function getExtension(string) {
    var index = string.lastIndexOf("\\");
    return string.substring(index + 1);
}