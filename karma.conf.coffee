module.exports = (config) ->
  config.set
    frameworks: [
      'mocha',
      'chai-sinon',
      'chai-things',
      'chai-as-promised'
    ]

    files: [
      {
        pattern: 'public/images/*.png'
        served: yes
        watched: no
        included: no
      }

      {
        pattern: 'public/images/*.gif'
        served: yes
        watched: no
        included: no
      }

      {
        pattern: 'public/images/*.jpg'
        served: yes
        watched: no
        included: no
      }

      {
        pattern: 'public/css/app.css'
        served: yes
        watched: no
        included: no
      }

      'public/js/app.js'
      'test/enviroment.js'
      'test/**/*-test.js'
    ]

    plugins: [
      'karma-mocha',
      'karma-chai-sinon',
      'karma-chai-plugins',
      'karma-safari-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher'
    ]

    browsers: [
      'PhantomJS_custom'
    ]

    customLaunchers:
      'PhantomJS_custom':
        base: 'PhantomJS'
        options:
          flags: ['--remote-debugger-port=9000']
          windowName: 'Blimp Boards'
          settings:
            loadImages: no
            webSecurityEnabled: no

    singleRun: yes
