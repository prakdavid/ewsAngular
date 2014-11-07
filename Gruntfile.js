'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet       = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder     = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/resources/js/<%= pkg.name %>.js',
                dest: 'src/resources/js/<%= pkg.name %>.js'
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0,
                report: 'min',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            js: {
                files: {
                    "src/resources/css/<%= pkg.name %>.css": ["app/resources/css/*.css"]
                }
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            css: {
                src: [
                    "src/resources/library/bootstrap/dist/css/bootstrap.min.css",
                    "src/resources/library/bootstrap/dist/css/bootstrap-responsive.min.css",
                    "src/resources/library/font-awesome/css/font-awesome.min.css",
                    "src/resources/library/cloud-admin/cloud-admin.min.css",
                    "src/resources/library/cloud-admin/themes/default.css",
                    "src/resources/library/cloud-admin/themes/responsive.min.css",
                    "src/resources/library/cloud-admin/animatecss/animate.min.css",
                    "src/resources/library/jquery-todo/css/styles.css",
                    "src/resources/library/fullcalendar/fullcalendar.css",
                    "src/resources/library/jquery.gritter/js/jquery.gritter.css",
                    "src/resources/library/bootstrap-daterangepicker/daterangepicker-bs3.css",
                    "src/resources/css/main.css"
                ],
                dest: "src/resources/css/<%= pkg.name %>.css"
            },
            components: {
                src: [
                    "src/resources/library/jquery/jquery.min.js",
                    "src/resources/library/jquery-ui/ui/minified/jquery-ui.min.js",
                    "src/resources/library/bootstrap/dist/js/bootstrap.min.js",
                    "src/resources/library/angular/angular.min.js",
                    "src/resources/library/angular-jquery/dist/angular-jquery.min.js",
                    "src/resources/library/jquery-todo/js/paddystodolist.js",
                    "src/resources/library/fullcalendar/fullcalendar.min.js",
                    "src/resources/library/jquery.gritter/css/jquery.gritter.min.css",
                    "src/resources/library/angular-route/angular-route.js"
                ],
                dest: "src/resources/js/<%= pkg.name %>_components.js"
            },
            js: {
                src: [
                    'src/app/**/*.js'
                ],
                dest: 'src/resources/js/<%= pkg.name %>.js'
              }
        },
        copy: {
            others: {
                files: [
                {
                    src: ['src/resources/library/font-awesome/fonts/*'],
                    dest: 'src/resources/fonts/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['src/resources/library/bootstrap/fonts/*'],
                    dest: 'src/resources/fonts/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['src/resources/library/jquery.gritter/images/*'],
                    dest: 'src/resources/images/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['src/resources/library/angular/angular.min.js.map'],
                    dest: 'src/resources/js/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                }
                ]
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },
            SomeWithOverrides: {
                options: {
                    curly: false,
                    undef: false,
                },
                files: {
                  src: ['src/app/**/*.js']
                }
            }
        },
        watch: {
            options: {
                nospawn: false
            },
            less: {
                files: ['src/resources/css/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'src/*.html',
                    'src/resources/css/{,*/}*.css',
                    'src/app/{,*/}*.js',
                    'src/resources/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            css: {
                files: ['src/resources/css/*.css'],
                tasks: ['concat:css']
            },
            js: {
                files: ['src/app/**/*.js'],
                tasks: ['jshint', 'concat:js']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        less: {
            server: {
                options: {
                    paths: ['src/resources/library/bootstrap/less', 'src/styles']
                },
                files: {
                    'src/resources/css/main.css': 'src/resources/css/main.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('server', function (target) {

        grunt.task.run([
            'jshint',
            'concat:css',
            'concat:components',
            'concat:js',
            'copy',
            'less:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('default', function (target) {

        grunt.task.run([
            'jshint',
            'concat:css',
            'concat:components',
            'concat:js',
            'copy',
            'less:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
};
