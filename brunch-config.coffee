exports.config =
  files:
    javascripts:
      joinTo:
        'js/app.js': /^(bower_components|vendor|app)/

    stylesheets:
      joinTo:
        'css/app.css': /^(bower_components|vendor|app)/

      order:
        before: ['bower_components/normalize-css/normalize.css']

    templates:
      joinTo: 'js/app.js'

  plugins:
    handlebars:
      include:
        enabled: false
