var pkg = require('./package.json');
var gulp = require('gulp');
var cached = require('gulp-cached');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var eslint = require('gulp-eslint');
var del = require('del');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject-string');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');

var copyright = '/*\n' +
    ' * Air load image - v' + pkg.version + '\n' +
    ' * Description: ' + pkg.description + '\n' +
    ' * author.name: ' + pkg.author.name + '\n' +
    ' * author.email: ' + pkg.author.email + '\n' +
    ' * ' + pkg.homepage + '\n' +
    ' * Created: ' + Date() + '\n' +
    ' */\n';

gulp.task('clean', function() {
    return del('dist');
});
gulp.task('build', function () {
    return gulp.src('src/**/*.js')
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: 'Build',
                message: err.message
            }))
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(inject.prepend(copyright + '\n'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(inject.prepend(copyright + '\n'))
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: ['./', './demo']
        },
        logConnections: true,
        logLevel: 'info',
        logFileChanges: true
    });

    browserSync.watch('./demo/**/*.*').on('change', browserSync.reload);
    browserSync.watch('./src/**/*.*').on('change', browserSync.reload);
});

gulp.task(
    'release',
    gulp.series(
        'clean',
        gulp.parallel(
            'build'
        )
    )
);
gulp.task(
    'default',
    gulp.series(
        'serve'
    )
);
