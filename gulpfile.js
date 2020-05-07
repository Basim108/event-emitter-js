const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rimraf = require('gulp-rimraf');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

const config = {
    jsDist: 'dist/',
    jsSrc: 'src/*.js',
    babel: {
        presets: ['@babel/env']
    }
};

function minify(cb) {
    return gulp.src(config.jsSrc)
        .pipe(babel(config.babel))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(config.jsDist));
};

function clean(cb) {
    return gulp.src(config.jsDist + '*.js', {read: false})
        .pipe(rimraf());
};

function copy(cb) {
    return gulp.src(config.jsSrc)
        .pipe(babel(config.babel))
        .pipe(gulp.dest(config.jsDist));
}

exports.default = gulp.series(clean, copy, minify);