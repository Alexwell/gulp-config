var gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		pug = require('gulp-pug'),
		sass =require('gulp-sass'),
		spritesmith = require('gulp.spritesmith'),
		rimraf = require('rimraf'),
		rename = require('gulp-rename'),
		autoprefixer = require('gulp-autoprefixer'),
		sourcemaps = require('gulp-sourcemaps'),
		htmlmin = require('gulp-htmlmin'),
		useref = require('gulp-useref'),
		uglify = require('gulp-uglify'),
		gulpif = require('gulp-if');
	
/*--------------Server--------------*/
gulp.task('server', function(){
	browserSync.init({
		server:{
			baseDir: "build"
		}
	});
	gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('pug:compile', function buildHTML(){
	return gulp.src('source/template/**/*.pug')
		.pipe(pug({
			pretty:true
		}))
		.pipe(gulp.dest('source'))
});

/*--------------HTML compile--------------*/
// gulp.task('html:compile', function(){
// 	return gulp.src('source/**/*.html')
// 		.pipe(htmlmin(
// 		{
// 			collapseWhitespace: true
// 		}))
// 		.pipe(gulp.dest('build'))
// });

/*--------------Scss compile--------------*/
gulp.task('styles:compile', function(){
	return gulp.src('source/styles/main.+(sass|scss)')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']}))
		.pipe(rename('main.min.css'))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('build/css'));
});

/*--------------HTML JS--------------*/
gulp.task('html:compile', function(){
	return gulp.src('source/**/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(htmlmin(
		{
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('build'));
});

/*--------------Sprites--------------*/
gulp.task('sprite', function(cb){
	var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		imgPath: '../images/sprite.png',
		cssName: 'sprite.scss'
	}));

	spriteData.img.pipe(gulp.dest('build/images'));
	spriteData.css.pipe(gulp.dest('source/styles/global'));
	cb();
});

/*--------------Delete--------------*/
gulp.task('clean', function del(cb){
	return rimraf('build', cb);
});

/*--------------Copy fonts--------------*/
gulp.task('copy:fonts', function(){
	return gulp.src('./source/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts'));
});

/*--------------Copy images--------------*/
gulp.task('copy:images', function(){
	return gulp.src('./source/images/**/*.*')
		.pipe(gulp.dest('build/images'));
});

/*--------------Copy - neeg gulp 4--------------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/*--------------Watchers--------------*/
gulp.task('watch', function(){
	// gulp.watch('source/template/**/*.pug', gulp.series('pug:compile'));
	gulp.watch('source/**/*.html', gulp.series('html:compile'));
	gulp.watch(['source/styles/**/*.scss', 'source/styles/**/*.css'], gulp.series('styles:compile'));
	// gulp.watch('source/js/**/*.js', gulp.series('js:compile'));
});

gulp.task('default', gulp.series(
	'clean',
	// 'pug:compile',
	gulp.parallel('html:compile', 'styles:compile', 'sprite', 'copy'),
	gulp.parallel('watch', 'server')
	)
);