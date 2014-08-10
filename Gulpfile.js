var gulp = require('gulp'),
	express = require('express'),
    plugins = require("gulp-load-plugins")(),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
	refresh = require('gulp-livereload'),
	livereload = require('connect-livereload'),
    lr = require('tiny-lr'),
    lrserver = lr(),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    clean = require('gulp-clean'),
    stylish = require('jshint-stylish-ex'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css');

// array of vendor JS to include in the project
var vendorList = ['bower_components/jquery/dist/jquery.min.js', 'bower_components/fancybox/source/jquery.fancybox.pack.js'];

// Server config
var server = express();
server.use(livereload({
    port: 35729
}));
server.use(express.static('./build'));

// Process LESS
gulp.task('less', function () {
    gulp.src('dev/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('build/css/'))
    .pipe(concat('main.css'))
    .pipe(minifyCSS())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css/'))
    .pipe(refresh(lrserver))
});

// Process Images
gulp.task('images', function () {
    return gulp.src('dev/img/**/*')
        .pipe(imagemin({
            progressive: false,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('build/img'))
        .pipe(refresh(lrserver));
});


// Process HTML
gulp.task('html', function () {
    gulp.src('dev/views/**/*.html')
    .pipe(gulp.dest('build'))
    .pipe(refresh(lrserver));
});

// Process Fonts
gulp.task('fonts', function () {
    var fonts_src = [
        'dev/fonts/**/*',
        'bower_components/fontawesome/fonts/**/*'
    ];

    gulp.src(fonts_src)
    .pipe(gulp.dest('build/fonts'))
    .pipe(refresh(lrserver));
});

gulp.task('clean', function () {
     return gulp.src(['build/**/*'], {
         read: false
     })
     .pipe(clean());
});

gulp.task('jslint', function () {
    return gulp.src('dev/js/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish));
});

gulp.task('compress', function () {
    return gulp.src('dev/js/**/*.js')
    //.pipe(uglify())                                                   Uglify removed during dev
    .pipe(plugins.concat('script.min.js'))
    .pipe(gulp.dest('build/js'));
});

// explicitly include all js vendor plugins we use
gulp.task('jsvendor', function () {
    return gulp.src(vendorList)
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('build', function () {
    gulp.start('html', 'less', 'images', 'fonts', 'jslint', 'compress', 'jsvendor');
});

gulp.task('serve', function () {
    server.listen(3000);
    lrserver.listen(35729);
});

gulp.task('watch', function () {
    gulp.watch('dev/less/**/*.less', ['less']);
    gulp.watch('dev/views/**/*.html', ['html']);
    gulp.watch('dev/img/**/*', ['images']);
    gulp.watch('dev/js/**/*', ['jslint', 'compress']);
});

gulp.task('default', /*['clean'],*/ function () {
    gulp.start('build', 'serve', 'watch');
});

