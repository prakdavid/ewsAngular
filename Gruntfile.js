'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
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
                src: 'app/resources/js/<%= pkg.name %>.js',
                dest: 'app/resources/js/<%= pkg.name %>.js'
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
                    "app/resources/css/<%= pkg.name %>.css": ["app/resources/css/*.css"]
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
                    "app/components/bootstrap/dist/css/bootstrap.min.css",
                    "app/components/bootstrap/dist/css/bootstrap-responsive.min.css",
                    "app/components/font-awesome/css/font-awesome.min.css",
                    "app/components/cloud-admin/cloud-admin.min.css",
                    "app/components/cloud-admin/themes/default.css",
                    "app/components/cloud-admin/themes/responsive.min.css",
                    "app/components/cloud-admin/animatecss/animate.min.css",
                    "app/components/jquery-todo/css/styles.css",
                    "app/components/fullcalendar/fullcalendar.css",
                    "app/components/jquery.gritter/js/jquery.gritter.css",
                    "app/components/bootstrap-daterangepicker/daterangepicker-bs3.css",
                    "app/resources/css/main.css"
                ],
                dest: "app/resources/css/<%= pkg.name %>.css"
            },
            components: {
                src: [
                    "app/components/jquery/jquery.min.js",
                    "app/components/jquery-ui/ui/minified/jquery-ui.min.js",
                    "app/components/bootstrap/dist/js/bootstrap.min.js",
                    "app/components/angular/angular.min.js",
                    "app/components/angular-jquery/dist/angular-jquery.min.js",
                    "app/components/jquery-todo/js/paddystodolist.js",
                    "app/components/fullcalendar/fullcalendar.min.js",
                    "app/components/jquery.gritter/css/jquery.gritter.min.css",
                    "app/components/angular-route/angular-route.js"
                ],
                dest: "app/resources/js/<%= pkg.name %>_components.js"
            },
            js: {
                src: [
                    'app/scripts/**/*.js'
                ],
                dest: 'app/resources/js/<%= pkg.name %>.js'
              }
        },
        copy: {
            others: {
                files: [
                {
                    src: ['app/components/font-awesome/fonts/*'],
                    dest: 'app/resources/fonts/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['app/components/bootstrap/fonts/*'],
                    dest: 'app/resources/fonts/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['app/components/jquery.gritter/images/*'],
                    dest: 'app/resources/images/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['app/components/angular/angular.min.js.map'],
                    dest: 'app/resources/js/',
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
                  src: ['app/scripts/**/*.js']
                }
            }
        },
        watch: {
            options: {
                nospawn: false
            },
            less: {
                files: ['app/styles/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/styles/{,*/}*.css',
                    'app/scripts/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            css: {
                files: ['app/resources/css/*.css'],
                tasks: ['concat:css']
            },
            js: {
                files: ['app/scripts/**/*.js'],
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
                    paths: ['app/components/bootstrap/less', 'app/styles']
                },
                files: {
                    'app/resources/css/main.css': 'app/resources/css/main.less'
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