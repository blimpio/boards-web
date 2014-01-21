exports.config =
  files:
    javascripts:
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

    handlebars:
      include:
        enabled: false
      overrides: (handlebars) ->
        handlebars.JavaScriptCompiler::nameLookup = (parent, name, type) ->
          if type is 'context'
            "Zeppelin.getHandlebarsAttribute(" + parent + ", " + @quotedString(name) + ")"
          else
            wrap = yes if parent.indexOf 'depth' is 0

            if /^[0-9]+$/.test name
              ret = parent + "[" + name + "]"
            else if handlebars.JavaScriptCompiler.isValidJavaScriptVariableName name
              ret = parent + "." + name
            else
              ret = parent + "['" + name + "']"

            if wrap
              '(' + parent + ' && ' + ret + ')'
            else
              ret
