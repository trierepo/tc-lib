module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                src: ['./dist/app/tcLib.js', './dist/app/**/*.js'],
                dest: './dist/tc-lib.js'
            }
        },

        clean: {
            dist: ['./dist'],
        },
        
        uglify: {
            js: {
                src: ['./dist/tc-lib.js'],
                dest: './dist/tc-lib.min.js'
            }
        },

        ngtemplates: {
            options: {
                htmlmin: {
                    collapseBooleanAttributes:      true,
                    collapseWhitespace:             true,
                    removeAttributeQuotes:          false,
                    removeComments:                 true,
                    removeEmptyAttributes:          false,
                    removeRedundantAttributes:      true,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                  }
            },
            app: {
                src: 'app/**/*.html',
                dest: 'dist/app/templates.js'
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [{
                    expand: true,
                    src: ['app/**/*.js'],
                    dest: './dist',
                }]
            }
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate'); 
    grunt.loadNpmTasks('grunt-angular-templates');


    //register grunt default task
    grunt.registerTask('default', ['clean:dist', 'ngAnnotate', 'ngtemplates', 'concat', 'uglify']);
    grunt.registerTask('build', ['clean:dist', 'ngAnnotate', 'ngtemplates', 'concat', 'uglify']);
};
