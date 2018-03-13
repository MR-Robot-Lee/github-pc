const gulp = require('gulp');
const browserify = require('gulp-browserify');
const cssnano = require('cssnano');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const nodemon = require('gulp-nodemon');
const connect = require('gulp-connect');
const del = require('del');
const runSequence = require('run-sequence');
const ejs = require('browserify-ejs');
const sprites = require('postcss-sprites');
const urlrev = require('postcss-urlrev');

const uglify = require('gulp-uglifyjs');
const cssmin = require('gulp-minify-css');
/**
 * 登录
 */
gulp.task('login', function () {
    return gulp.src('fe/src/login.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 首页
 */
gulp.task('index', function () {
    return gulp.src('fe/src/index.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
gulp.task('dashbord', function () {
    return gulp.src('fe/src/dashbord.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
gulp.task('communique', function () {
    return gulp.src('fe/src/communique.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 公司
 */
gulp.task('company', function () {
    return gulp.src('fe/src/company.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 审批
 */
gulp.task('approval', function () {
    return gulp.src('fe/src/approval.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
gulp.task('knowledge', function () {
    return gulp.src('fe/src/knowledge.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 文档
 */
gulp.task('document', function () {
    return gulp.src('fe/src/document.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        /*.pipe(uglify({
          outSourceMap: true
        }))*/
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 施工快报
 */
gulp.task('report', function () {
    return gulp.src('fe/src/report.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 现场
 */
gulp.task('locale', function () {
    return gulp.src('fe/src/locale.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
gulp.task('project', function () {
    return gulp.src('fe/src/project.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        /*.pipe(uglify({
          outSourceMap: true
        }))*/
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
gulp.task('system', function () {
    return gulp.src('fe/src/system.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 员工
 */
gulp.task('employee', function () {
    return gulp.src('fe/src/employee.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 企业库
 */
gulp.task('enterprise', function () {
    return gulp.src('fe/src/enterprise.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});
/**
 * 企业库
 */
gulp.task('bids', function () {
    return gulp.src('fe/src/bids.js')
        .pipe(browserify({
            insertGlobals: true,
            transform: [ejs],
            debug: true
        }))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});


gulp.task('css', function () {
    const processors = [
        cssnano({
            autoprefixer: {
                add: true,
                remove: true,
                browsers: ['> 0%'],
            },
            discardComments: {
                removeAll: true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,

            safe: true,
            sourcemap: true,
        }),
        sprites({
            stylesheetPath: './dist',
            spritePath: './dist',
            filterBy: function (image) {
                if (!/\.png$/.test(image.url)) {
                    return Promise.reject();
                }
                return Promise.resolve();
            }
        })
    ];
    return gulp.src(['fe/src/styles/main.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('dist'))
        .pipe(postcss([urlrev()]))
        .pipe(cssmin())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('img', function () {
    return gulp.src(['fe/src/styles/images/**/*'])
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload());
});
gulp.task('upload', function () {
    return gulp.src(['fe/src/styles/plugins/**/*'])
        .pipe(gulp.dest('dist/lib/plugins/image/images'))
        .pipe(connect.reload());
});
gulp.task('lib.js', function () {
    return gulp.src(['fe/lib/**/*.js'])
        .pipe(gulp.dest('dist/lib'))
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(connect.reload());
});
gulp.task('lib-css', function () {
    return gulp.src(['fe/lib/css/*'])
        .pipe(gulp.dest('dist/lib/css'))
        .pipe(connect.reload());
});
gulp.task('lib-htc', function () {
    return gulp.src(['fe/lib/htc/*.htc'])
        .pipe(gulp.dest('dist/lib/htc'))
        .pipe(connect.reload());
});
gulp.task('lib-fonts', function () {
    return gulp.src(['fe/lib/fonts/*'])
        .pipe(gulp.dest('dist/lib/fonts'))
        .pipe(connect.reload());
});
gulp.task('html', function () {
    return gulp.src(['.gitignore']).pipe(connect.reload());
});

gulp.task('clean', () => del(['./dist'], {dot: true, force: true}));


gulp.task('dev-start', ['login',
    'index', 'dashbord', 'employee',
    'company', 'communique', 'approval',
    'knowledge', 'document', 'report', 'bids',
    'locale', 'project', 'system', 'enterprise',
    'css', 'img', 'lib.js', 'lib-css', 'lib-fonts', 'lib-htc', 'upload'], () => {
    // nodemon('./server/index.js --watch ./node_modules --watch ./server --ignore ./server/views');
    nodemon({
        script: './server/index.js',
        watch: ['./node_modules', './server'],
        ignore: ['./server/views'],
        env: {
            PORT: '3000'
        },
        execMap: {
            js: "node --harmony"
        }
    });
    connect.server({livereload: true});
    gulp.watch(['fe/lib/**/*'], ['lib']);
    gulp.watch(['fe/src/**/*.js', 'fe/src/**/*.ejs'], ['login',
        'index', 'dashbord', 'employee',
        'company', 'communique', 'approval',
        'knowledge', 'document', 'report', 'bids',
        'locale', 'project', 'system', 'enterprise']);
    gulp.watch(['fe/src/**/*.scss'], ['css']);
    gulp.watch(['fe/src/styles/images/**/*'], ['img']);
    gulp.watch(['server/views/**/*'], ['html']);
});

gulp.task('dev', function (cb) {
    runSequence('clean', 'dev-start', cb);
});
gulp.task('production', ['login',
    'index', 'dashbord', 'employee',
    'company', 'communique', 'approval',
    'knowledge', 'document', 'report', 'bids',
    'locale', 'project', 'system', 'enterprise',
    'css', 'img', 'lib.js', 'lib-css', 'lib-fonts', 'lib-htc', 'upload']);
