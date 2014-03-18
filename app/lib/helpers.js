_.mixin({'asset': function(path) {
  return App.STATIC_URL + path;
}});

_.mixin({'createController': function(name, options) {
  var Collection = require('controllers/' + name);
  return new Collection(options);
}});

_.mixin({'createView': function(name, options) {
  var View = require('views/' + name);
  return new View(options);
}});

_.mixin({'createModel': function(name, attributes, options) {
  var Model = require('models/' + name);
  return new Model(attributes, options);
}});

_.mixin({'createCollection': function(name, models, options) {
  var Collection = require('collections/' + name);
  return new Collection(models, options);
}});

// Decodes a JSON Web Token.
_.mixin({'decodeJWT': function(token) {
  // Get the part of the token where data is stored.
  token = token.split('.')[1];

  // Make URL friendly.
  token = token.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');

  // Reverse to original encoding.
  if (token.length % 4 !== 0) {
    token += ('===').slice(0, 4 - (token.length % 4));
  }

  token = token.replace(/-/g, '+').replace(/_/g, '/');

  // Return the token data decoded.
  return JSON.parse(atob(token));
}});

$(document).on('click', '[data-route=true]', function(event) {
  if (!event.metaKey) {
    event.preventDefault();
    Backbone.Events.trigger('router:navigate', $(this).attr('href'));
  }
});

Handlebars.registerHelper('markdown', function(str) {
  var parse;

  str = _.isFunction(str) ? str() : str;

  if (!str) return new Handlebars.SafeString('');

  parse = marked.setOptions({
    renderer: new marked.Renderer(),
    breaks: true,
    sanitize: true,
    smartypants: true
  });

  return new Handlebars.SafeString(parse(str));
});
