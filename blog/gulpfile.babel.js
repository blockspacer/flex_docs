'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';

const $ = gulpLoadPlugins();
const child = require('child_process');
const checkGem = require('gulp-check-gems');
const wait = require('gulp-wait');
const open = require('gulp-open');
const prefix = require('gulp-autoprefixer');
const cssmin = require('gulp-cssnano');
const rename = require('gulp-rename');
const sassLint = require('gulp-sass-lint');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');
const notify = require('gulp-notify');

// Include paths file.
const paths = require('./_scripts/gulp_config/paths');

//variables
const host = "0.0.0.0";
const port = 4096;

var prefixerOptions = {
  browsers: ['last 2 versions']
};

var sassOptions = {
  outputStyle: 'expanded',
  includePaths: ['css']
};

var inlineSassOptions = {
  outputStyle: 'expanded',
  includePaths: ['css']
};

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};

// Delete the _site directory.
gulp.task('cleanup-build', () => {
  return gulp.src(paths.siteFolderName, {read: false})
      .pipe($.clean());
});

// Minify the HTML.
gulp.task('minify-html', () => {
  return gulp.src(paths.siteFolderName + '/**/*.html')
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest(paths.siteFolderName));
});

// Optimize images.
//gulp.task('minify-images', () => {
//  gulp.src('images/**/*')
//    .pipe($.imagemin({
//      progressive: true,
//      interlaced: true
//    }))
//    .pipe(gulp.dest(paths.siteFolderName + '/images'));
//});

// Concatenate, transpiles ES2015 code to ES5 and minify JavaScript.
gulp.task('scripts', () => {
  gulp.src([
    // Note: You need to explicitly list your scripts here in the right order
    //       to be correctly concatenated
    './_scripts/main.js'
  ])
    .pipe($.concat('main.min.js'))
    .pipe($.babel())
    .pipe($.uglify())
    .pipe(gulp.dest('scripts'));
});

// Minify and add prefix to css.
gulp.task('css', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src('css/main.css')
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cssnano())
    .pipe(gulp.dest(paths.siteFolderName + '/css'));
});

// Compile scss to css.
gulp.task('scss', () => {
  runSequence(
    'include-scss',
    'inline-scss'
  )
});

// Compile include scss to css.
gulp.task('include-scss', () => {
    return gulp.src('scss/main.scss')
        .pipe(plumber({errorHandler: onError}))
        //.pipe(rev())
        .pipe(sourcemaps.init())
        .pipe($.sass(sassOptions))
        .pipe(prefix(prefixerOptions))
        .pipe(gulp.dest('css'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'));
});

// Compile inline scss to css.
gulp.task('inline-scss', () => {
    return gulp.src('scss/inline.scss')
        .pipe(plumber({errorHandler: onError}))
        //.pipe(rev())
        .pipe(sourcemaps.init())
        .pipe($.sass(sassOptions))
        .pipe(prefix(prefixerOptions))
        .pipe(gulp.dest('_includes/inline'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('_includes/inline'));
});

gulp.task('sass-lint', function() {
  gulp.src('scss/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

// Pug (Jade) to HTML.
gulp.task('pug', () => {
  return gulp.src([
    '_includes-pug/**/*.pug',
    '!' + paths.siteFolderName + '/node_modules/**'
  ])
  .pipe($.pug())
  .pipe(gulp.dest('_includes'));
});

// Watch change in files.
gulp.task('serve', ['jekyll-build'], () => {
  browserSync.init({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: paths.siteFolderName,
    port: 4000
  });

  // Warch html changes.
  gulp.watch([
    'css/**/*.css',
    '!css/**/*.min.css',
    '!css/**/*-*.css',
    'scripts/**/*.js',
    '_scripts/**/*.js',
    '_includes/**/*.html',
    '_layouts/**/*.html',
    '_posts/**/*.md',
    '_docs/**/*.md',
    'data/**/*.json',
    'data/**/*.yml',
    '_data/**/*.json',
    '_data/**/*.yml',
    '_includes/data/**/*.json',
    '*.md',
    'index.html'
  ], ['jekyll-build', browserSync.reload]);

  // Watch Pug (Jade) changes.
  gulp.watch('_includes-pug/**/*.pug', ['pug']);

  // Watch scss changes.
  gulp.watch('scss/**/*.scss', ['scss', 'sass-lint']);

  // Watch JavaScript changes.
  gulp.watch('_scripts/**/*.js', ['scripts']);
});

gulp.task('generate-service-worker', (callback) => {
  var path = require('path');
  var rootDir = paths.siteFolderName;

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,json}'],
    stripPrefix: rootDir,
    replacePrefix: '/docsspace'
  }, callback);
});

  gulp.task('fix-config', () => {
    gulp.src('_config.yml')
      .pipe($.replace('baseurl: ""', 'baseurl: "docsspace"'))
      .pipe($.clean())
      .pipe(gulp.dest('.'));
  });

  gulp.task('revert-config', () => {
    gulp.src('_config.yml')
        .pipe($.replace('baseurl: "docsspace"', 'baseurl: ""'))
        .pipe($.clean())
        .pipe(gulp.dest('.'));
  });

  //gulp.task('jekyll-htmlproofer', () => {
  //  const htmlproofer = child.spawn('bundle', [
  //      'exec',
  //      'htmlproofer',
  //      './' + paths.siteFolderName,
  //      '--disable-external',
  //      '--allow-hash-href'
  //  ], {
  //      stdio: 'inherit'
  //  });
  //});

gulp.task('jekyll-build', ['scripts', 'scss', 'sass-lint'], $.shell.task(['bundle exec jekyll build --verbose --trace']));

gulp.task('jekyll-build-for-deploy', $.shell.task(['bundle exec jekyll build --verbose --trace']));

// Default task.
gulp.task('build', () =>
  runSequence(
    'fix-config',
    'cleanup-build',
    'pug',
    'scss',
    'sass-lint',
    'scripts',
    'jekyll-build-for-deploy',
    'minify-html',
    'css',
    'generate-service-worker',
    //'minify-images',
    'revert-config',
    //'jekyll-htmlproofer'
  )
);

gulp.task('admin-run', function () {
    const jekyll = child.spawn('bundle', [
        'exec',
        'jekyll',
        'serve',
        '--incremental',
        '--force_polling',
        '--open-url',
        '--host', host,
        '--port', port
    ], {
        stdio: 'inherit'
    });
});

//gulp.task('admin-site', function () {
//    gulp.src(__filename)
//            .pipe(checkGem({gemfile: 'jekyll-manager'}, open({uri: 'http://' + host + ':' + port + '/admin'})));
//});

//gulp.task('admin', ['serve', 'admin-run', 'admin-site']);

// Depoly website to gh-pages.
gulp.task('gh-pages', () => {
  return gulp.src('./' + paths.siteFolderName + '/**/*')
    .pipe($.ghPages());
});

gulp.task('deploy', () => {
  runSequence(
    'fix-config',
    'cleanup-build',
    'pug',
    'scss',
    'scripts',
    'jekyll-build-for-deploy',
    'minify-html',
    'css',
    'generate-service-worker',
    //'minify-images',
    'gh-pages',
    'revert-config'
  )
});

