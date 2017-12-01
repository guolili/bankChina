/**
 * Created by Nan on 2017/11/30.
 */
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var mock = require("mockjs");
var webserver = require("gulp-webserver");

gulp.task("webserver", function () {
    gulp.src("./")
        .pipe(webserver({
            host: "localhost",
            port: 8090,
            open: true,
            fallback: "index.html",
            livereload: true
        }));
});

gulp.task("interface", function () {
    gulp.src("./")
        .pipe(webserver({
            host: "localhost",
            port: 8080,
            middleware: function (req, res, next) {
                res.writeHead(200, {
                    "Content-type": "text/json;charset=utf8",
                    "Access-Control-Allow-Origin": "*"
                });
                if (req.url == "/userinfo") {
                    var data = {
                        "username": "1511B",
                        "classroom": 34411,
                        "teacher": "heinan",
                        "fudaoyuan": "qikailong",
                        "kouhao": "我最牛逼！"
                    };
                    res.end(JSON.stringify(data));
                }
                else if (req.url == "/news") {
                    var data = mock.mock({
                        "id": "@name",
                        "email": "@email",
                        "content": "@csentence"
                    })
                    res.end(JSON.stringify(data));
                }
                else {
                    var filename = req.url.split("/")[1];
                    var dataFile = path.join(__dirname, "data", filename+".json");

                    fs.exists(dataFile, function (exist) {

                        if (exist) {
                            fs.readFile(dataFile, function (err, data) {
                                if (err) return console.error(err);
                                res.end(data);
                            });
                        } else {
                            var data = "can't find file: " + filename;
                            res.end(data);
                        }
                    });
                }
                next();
            }
        }));
});
gulp.task("default", function () {
    gulp.start("webserver","interface")
});