exports.config =
  files:
    javascripts:
      joinTo:
        'js/app.js': /^(vendor|bower_components|app)/

    stylesheets:
      joinTo: 'css/app.css'

    templates:
      joinTo: 'js/app.js'

  plugins:
    handlebars:
      include:
        enabled: false
