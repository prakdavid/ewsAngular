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
                src: 'manager/resources/js/<%= pkg.name %>.js',
                dest: 'manager/resources/js/<%= pkg.name %>.js'
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
                    "manager/resources/css/<%= pkg.name %>.css": ["manager/resources/css/*.css"]
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
                    "manager/components/bootstrap/dist/css/bootstrap.min.css",
                    "manager/components/bootstrap/dist/css/bootstrap-responsive.min.css",
                    "manager/components/font-awesome/css/font-awesome.min.css",
                    "manager/components/cloud-admin/cloud-admin.min.css",
                    "manager/components/cloud-admin/themes/default.css",
                    "manager/components/cloud-admin/themes/responsive.min.css",
                    "manager/components/cloud-admin/animatecss/animate.min.css",
                    "manager/components/jquery-todo/css/styles.css",
                    "manager/components/fullcalendar/fullcalendar.css",
                    "manager/components/jquery.gritter/js/jquery.gritter.css",
                    "manager/components/bootstrap-daterangepicker/daterangepicker-bs3.css",
                    "manager/resources/css/main.css"
                ],
                dest: "manager/resources/css/<%= pkg.name %>.css"
            },
            components: {
                src: [
                    "manager/components/jquery/jquery.min.js",
                    "manager/components/jquery-ui/ui/minified/jquery-ui.min.js",
                    "manager/components/bootstrap/dist/js/bootstrap.min.js",
                    "manager/components/angular/angular.min.js",
                    "manager/components/angular-jquery/dist/angular-jquery.min.js",
                    "manager/components/jquery-todo/js/paddystodolist.js",
                    "manager/components/fullcalendar/fullcalendar.min.js",
                    "manager/components/jquery.gritter/css/jquery.gritter.min.css",
                    "manager/components/angular-route/angular-route.min.js",
                    "manager/components/angular-cookies/angular-cookies.min.js",
                    "manager/components/angular-resource/angular-resource.min.js",
                    "manager/components/angular-sanitize/angular-sanitize.min.js"
                ],
                dest: "manager/resources/js/<%= pkg.name %>_components.js"
            },
            js: {
                src: [
                    'manager/scripts/**/*.js'
                ],
                dest: 'manager/resources/js/<%= pkg.name %>.js'
              }
        },
        copy: {
            others: {
                files: [
                {
                    src: ['manager/components/font-awesome/fonts/*'],
                    dest: 'manager/resources/fonts/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['manager/components/bootstrap/fonts/*'],
                    dest: 'manager/resources/fonts/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['manager/components/jquery.gritter/images/*'],
                    dest: 'manager/resources/images/',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                },
                {
                    src: ['manager/components/angular/angular.min.js.map'],
                    dest: 'manager/resources/js/',
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
                  src: ['manager/scripts/**/*.js']
                }
            }
        },
        watch: {
            options: {
                nospawn: false
            },
            less: {
                files: ['manager/styles/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'manager/*.html',
                    "manager/partials/**/*.html",
                    "manager/scripts/directives/**/*.html",
                    "manager/api/**/*.php",
                    'manager/styles/{,*/}*.css',
                    'manager/scripts/{,*/}*.js',
                    'manager/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            css: {
                files: ['manager/resources/css/*.css'],
                tasks: ['concat:css']
            },
            js: {
                files: ['manager/scripts/**/*.js'],
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
                            mountFolder(connect, 'manager'),
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
                    paths: ['manager/components/bootstrap/less', 'manager/styles']
                },
                files: {
                    'manager/resources/css/main.css': 'manager/resources/css/main.less'
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