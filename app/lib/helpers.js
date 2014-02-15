module.exports = (function() {
  _.mixin({'getModel': function(name) {
    if (!Boards.Models[name]) Boards.Models[name] = _.createModel(name.toLowerCase());
    return Boards.Models[name];
  }});

  _.mixin({'getCollection': function(name) {
    if (!Boards.Collections[name]) Boards.Collections[name] = _.createCollection(name.toLowerCase());
    return Boards.Collections[name];
  }});

  _.mixin({'createController': function(path, options) {
    var Collection = require('controllers/' + path);
    return new Collection(options || {});
  }});

  _.mixin({'createView': function(path, options) {
    var View = require('views/' + path);
    return new View(options || {});
  }});

  _.mixin({'createModel': function(path, options) {
    var Model = require('models/' + path);
    return new Model(options || {});
  }});

  _.mixin({'createCollection': function(path, options) {
    var Collection = require('collections/' + path);
    return new Collection(options || {});
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

  $(document).on('click', '[data-route]', function(event) {
    if (!event.metaKey) {
      event.preventDefault();
      Backbone.Events.trigger('router:navigate', $(this).data('route'));
    }
  });
})();
