const gulp = require('gulp')
const fileInclude = require('gulp-file-include')
const replace = require('gulp-replace')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const runSequence = require('run-sequence')
const connect = require('gulp-connect')
const del = require('del')
const prefix = require('gulp-autoprefixer')
const chokidar = require('chokidar')
const cssMin = require('gulp-clean-css')
const htmlMin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const gulpIf = require('gulp-if')
const client = require('scp2')

let env = 'development'    // development(开发模式) | product(生产模式)
const gulpConfig = {
  dist: 'dist',
  static: 'static',
  // 配置首页
  homePage: '##/pages/home.html'
}

// 删除目录
gulp.task('clean', _ => {
  return del([`${gulpConfig.dist}/`, 'rev/'])
})
// html合并任务
gulp.task('include', _ => {
  return gulp.src(['src/pages/**/*.html']).pipe(fileInclude({
    prefix: '@@'
  })).pipe(gulp.dest(`${gulpConfig.dist}/${gulpConfig.static}/pages`))
})
// index页面处理
gulp.task('index', _ => {
  return gulp.src(['src/index.html'])
    .pipe(replace('$homePage', `${gulpConfig.homePage}`))
    .pipe(replace('##', `/${gulpConfig.static}`))
    .pipe(gulp.dest(`${gulpConfig.dist}`))
})
// 拷贝网站图标
gulp.task('favicon', _ => {
  return gulp.src('src/favicon/*')
    .pipe(gulp.dest(`${gulpConfig.dist}`))
})
// 拷贝vendors第三方库目录
gulp.task('vendor', _ => {
  return gulp.src('src/vendors/**/*')
    .pipe(gulp.dest(`${gulpConfig.dist}/${gulpConfig.static}/vendors`))
})
// 图片文件名称加md5后缀
gulp.task('img', _ => {
  return gulp.src('src/images/**/*')
    .pipe(rev())
    .pipe(gulp.dest(`${gulpConfig.dist}/${gulpConfig.static}/images`))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/images'))
})
// css引用图片路径替换、添加浏览器前缀、css文件名加md5后缀、生产模式会进行css压缩
gulp.task('css', _ => {
  return gulp.src(['rev/images/*.json', 'src/styles/**/*.css'])
    .pipe(replace('##', `/${gulpConfig.static}`))
    .pipe(revCollector())
    .pipe(prefix())
    .pipe(gulpIf(env === 'product', cssMin({compatibility: 'ie8', rebase: false})))
    .pipe(rev())
    .pipe(gulp.dest(`${gulpConfig.dist}/${gulpConfig.static}/styles`))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/styles'))
})
// js引用图片路径替换、js文件名加md5后缀、生产模式会进行js压缩混淆
gulp.task('js', _ => {
  return gulp.src(['rev/images/*.json', 'src/scripts/**/*.js'])
    .pipe(replace('##', `/${gulpConfig.static}`))
    .pipe(revCollector())
    .pipe(gulpIf(env === 'product', uglify({mangle: true})))
    .pipe(rev())
    .pipe(gulp.dest(`${gulpConfig.dist}/${gulpConfig.static}/scripts`))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/scripts'))
})
// html引用图片,js,css路径替换。生产模式会进行html压缩
gulp.task('html', _ => {
  return gulp.src(['rev/**/*.json', `${gulpConfig.dist}/${gulpConfig.static}/pages/**/*.html`])
    .pipe(replace('##', `/${gulpConfig.static}`))
    .pipe(revCollector())
    .pipe(gulpIf(env === 'product', htmlMin({removeComments: true, collapseWhitespace: true})))
    .pipe(gulp.dest(`${gulpConfig.dist}/${gulpConfig.static}/pages`))
})
// 启动服务
gulp.task('connect', _ => {
  return connect.server({
    root: gulpConfig.dist,
    port: 8888,
    livereload: true
  })
})
gulp.task('default', cb => {
  runSequence('clean', ['include', 'index', 'favicon', 'vendor'], 'img', ['css', 'js'], 'html', cb)
})
// 监控文件变化
gulp.task('watch', _ => {
  return chokidar.watch('src/', { ignoreInitial: true, ignorePermissionErrors: true }).on('all', (e, filePath) => {
    runSequence('default', 'reload')
  })
})
gulp.task('reload', _ => {
  return gulp.src(`${gulpConfig.dist}/`).pipe(connect.reload())
})
// 开发模式任务(开发)
gulp.task('dev', cb => {
  env = 'development'
  runSequence('default', ['connect', 'watch'], cb)
})
// 产品模式任务(打包)
gulp.task('prod', cb => {
  env = 'product'
  runSequence('default', cb)
})
// 产品发布到服务器
gulp.task('publish', _ => {
  console.log('开始上传到服务器')
  return client.scp('./dist/**', {
    // 服务器地址
    host: '',
    // 用户名
    username: '',
    // 密码
    password: '',
    // 服务器上传路径
    path: ''
  }, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('文件上传完毕!\n')
    }
  })
})