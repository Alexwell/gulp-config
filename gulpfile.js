var gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
		pug = require('gulp-pug'),
		sass =require('gulp-sass'),
		spritesmith = require('gulp.spritesmith'),
		rimraf = require('rimraf');

/*--------------Server--------------*/
gulp.task('server', function(){
	browserSync.init({
		server:{
			baseDir: "build"
		}
	});
	gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*--------------Pug compile--------------*/
gulp.task('templates:compile', function buildHTML(){
	return gulp.src('source/template/index.pug')
		.pipe(pug({
			pretty:true
		}))
		.pipe(gulp.dest('build'))
});

/*--------------Sass compile--------------*/
gulp.task('styles:compile', function(){
	return gulp.src('source/styles/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('build/css'));
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
	gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
	gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
	gulp.parallel('watch', 'server')
	)
);