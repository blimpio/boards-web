exports.config =
  files:
    javascripts:
      order: after: ['vendor/js/zeppelin.js']
      joinTo: 'js/app.js'
    stylesheets:
      joinTo: 'css/app.css'
    templates:
      joinTo: 'js/app.js'

  plugins:
    jshint:
      pattern: /^app\/.*\.js$/
      options:
        curly: true
        bitwise: true
      globals:
        _: true
        jQuery: true
        Zeppelin: true
        Backbone: true
      warnOnly: true
