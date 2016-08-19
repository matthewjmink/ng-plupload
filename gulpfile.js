'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var stripComments = require('gulp-strip-comments');
var stripDebug = require('gulp-strip-debug');
var ngFilesort = require('gulp-angular-filesort');

gulp.task('default', function(callback) {
  return gulp.src(['./src/**/*' ])
    .pipe(ngFilesort())
    .pipe(concat('ng-plupload.js'))
    .pipe(stripDebug())
    .pipe(stripComments())
    .pipe(gulp.dest('./dist'))
    .pipe(rename('ng-plupload.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});
