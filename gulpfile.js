var gulp       = require('gulp'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	cache        = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	return gulp.src('src/scss/**/*style.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	});
});

gulp.task('scripts', function() {
	return gulp.src([
		'src/js/main.js'
		])
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest('src/js'));
});

gulp.task('code', function() {
	return gulp.src('src/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', async function() {
	return del.sync('build');
});

gulp.task('img', function() {
	return gulp.src('src/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('build/img'));
});

gulp.task('prebuild', async function() {

	gulp.src([
		'src/css/style.css'
		])
	.pipe(gulp.dest('build/css'))

	gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('build/fonts'))

	gulp.src('src/js/**/*')
	.pipe(gulp.dest('build/js'))

	gulp.src('src/*.html')
	.pipe(gulp.dest('build'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch('src/*.html', gulp.parallel('code'));
	gulp.watch(['src/js/main.js'], gulp.parallel('scripts'));
});
gulp.task('default', gulp.parallel('sass', 'scripts', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'scripts'));