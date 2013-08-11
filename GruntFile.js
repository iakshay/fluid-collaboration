'use strict';
function log(err, stdout, stderr, cb) {
    console.log(stdout, stderr);
    cb();
}

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch:{
      scripts: {
        files: ['**/*.js', 'views/*.jade', 'public/*.css', '!node_modules/**'],
        options:{
          livereload:true
        }
      }
    },
    shell:{
      github:{
        command:'git push origin master',
        options: {
          callback: log
        }
      },
      heroku:{
        command:'git push heroku master',
        options: {
          callback: log
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          ignoredFiles: ['README.md', 'node_modules/**'],
          watchedExtensions: ['css', 'js', 'jade'],
          delayTime: 1,
          env: {
            PORT: '3000'
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
        target: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:target']);
  grunt.registerTask('deploy', ['shell']);
  // grunt.registerTask('default', ['concurrent:target']);
};