const gulp = require('gulp'); // 引入插件
const webserver = require('gulp-webserver');
const minifyCss = require('gulp-minify-css');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const fs = require('fs');
const path = require('path');
gulp.task('cssZip', function () { // css压缩
    gulp.src('./css/style.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./css/'));
});
gulp.task('sass', function () { // sass压缩
    gulp.src('./css/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css/'));
});
gulp.task('jss', function () {
    gulp.src('./javascripts/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('./javascripts/'));
});
gulp.task('webserver', function () { // 默认页面
    gulp.src('./')
        .pipe(webserver({
            port: 8020,
            open: true,
            fallback: 'bank.html',
            livereload: true
        }));
});
gulp.task('datainfo', function () { // 数据请求
    gulp.src('./')
        .pipe(webserver({
            port: 8010,
            middleware: function (req, res, next) {
                if (req.url === '/datainfo') {
                    var data = {
                        'student': {
                            'img': 'images/ban_1.jpg',
                            'list': ['一键缴费', '网上理财', '保险保障', '房屋贷款', '家庭贷款', '汽车贷款']
                        },
                        'work': {
                            'img': 'images/ban_2.jpg',
                            'list': ['一键缴费', '网上理财', '保险保障', '房屋贷款', '家庭贷款', '汽车贷款']
                        },
                        'family': {
                            'img': 'images/ban_3.jpg',
                            'list': ['一键缴费', '网上理财', '保险保障', '房屋贷款', '家庭贷款', '汽车贷款']
                        },
                        'money': {
                            'img': 'images/ban_4.jpg',
                            'list': ['一键缴费', '网上理财', '保险保障', '房屋贷款', '房屋贷款', '家庭贷款', '汽车贷款']
                        }
                    };
                    res.writeHead(200, {
                        'Content-type': 'text/json;charset=utf8',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify(data));
                } else {
                    var filename = req.url.split('/')[1];
                    var dataFile = path.join(__dirname, 'data', filename + '.json');
                    fs.exists(dataFile, function (exist) {
                        if (exist) {
                            fs.readFile(dataFile, function (err, data) {
                                if (err) {
                                    return console.error(err);
                                }
                                res.end(data);
                            });
                        } else {
                            var data = 'cantont' + filename;
                            res.end(data);
                        }
                    });
                }
                next(); // 跳出
            }
        }));
});
gulp.task('default', function () { // 默认调用任务
    gulp.start('webserver', 'datainfo', 'cssZip', 'sass', 'jss');
});