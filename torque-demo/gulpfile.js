var browserify = require('browserify'),
    watchify = require('watchify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    nodemon = require('gulp-nodemon'),
    concat = require('gulp-concat');

var sourceFile = './public/js/main.js',
    bundleFolder = './public/js/',
    bundleFile = 'app-bundle.js',
    vendorCssBundleFolder = './public/css/',
    vendorCssBundle = 'vendor-bundle.css';

var vendorCss = [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "node_modules/bootstrap/dist/css/bootstrap-theme.min.css",
    "node_modules/leaflet/dist/leaflet.css"
];

var bundleConfig = {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true,
    entries: sourceFile
};

 var bundle = function(b) {
    return b.bundle()
        .pipe(source(bundleFile)) // converts stream so gulp can understand it
        .pipe(gulp.dest(bundleFolder));
  };

// Bundles all public code
gulp.task('browserify-app', function () {
  var b = browserify(bundleConfig);

  return bundle(b);
});

// Bundles all public vendor libs
gulp.task('watchify-app', function () {
    var b = watchify(browserify(bundleConfig));

    var rebundle = function () {
        console.log('rebundle...');
        return bundle(b);
    };

    b.on('update', rebundle);

    return rebundle();
});

gulp.task('concat-vendor-css', function() {
  return gulp.src(vendorCss)
    .pipe(concat(vendorCssBundle))
    .pipe(gulp.dest(vendorCssBundleFolder));
});


// Init nodemon. Run 'browserify-libs' and 'browserify-app' sync prior.
gulp.task('start', ['watchify-app'], function () {
  nodemon({
    debug: true,
    script: 'app.js',
    env: { 'NODE_ENV': 'development' },
    ignore: ['./public/']
  });
});

gulp.task('default', ['watchify-app', 'concat-vendor-css', 'start']);
