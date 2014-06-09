module.exports = function(config) {
  config.set({
    frameworks: [
      'mocha',
      'chai-sinon',
      'chai-things',
      'chai-as-promised'
    ],

    files: [
      {
        pattern: 'public/images/*.png',
        served: true,
        watched: false,
        included: false
      },

      {
        pattern: 'public/images/*.gif',
        served: true,
        watched: false,
        included: false
      },

      {
        pattern: 'public/images/*.jpg',
        served: true,
        watched: false,
        included: false
      },

      {
        pattern: 'public/css/app.css',
        served: true,
        watched: false
        included: false
      },

      'public/js/app.js',
      'test/enviroment.js',
      'test/**/*-test.js'
    ],

    plugins: [
      'karma-mocha',
      'karma-chai-sinon',
      'karma-chai-plugins',
      'karma-safari-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher'
    ],

    browsers: [
      'PhantomJS_custom'
    ],

    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          flags: ['--remote-debugger-port=9000'],
          windowName: 'Blimp Boards',
          settings: {
            loadImages: false,
            webSecurityEnabled: false
          }
        }
      }
    },

    singleRun: true
  });
};
