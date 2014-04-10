_.mixin({'asset': function(path) {
  return App.STATIC_URL + path;
}});

_.mixin({'preventNavigation': function(message) {
  if (message) window.onbeforeunload = function() {
    return message;
  }
}});

_.mixin({'restoreNavigation': function(message) {
  window.onbeforeunload = null;
}});

_.mixin({'createController': function(name, options) {
  var Collection = require('controllers/' + name);
  return new Collection(options);
}});

_.mixin({'createLayout': function(name, options) {
  var Layout = require('layouts/' + name);
  return new Layout(options);
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

_.mixin({'markdown': function(text) {
  var parser = marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    sanitize: true,
    smartypants: true
  });

  return parser(text);
}});

_.mixin({'isLetterKey': function(key) {
  var notAllowed = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34,
  35, 36, 37, 38, 39, 40, 45, 46];

  return _.indexOf(notAllowed, key) === -1;
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
    gfm: true,
    tables: true,
    breaks: true,
    sanitize: true,
    smartypants: true
  });

  return new Handlebars.SafeString(parse(str));
});

Handlebars.registerHelper('markdown-preview', function(str) {
  var parse,
      renderer = new marked.Renderer();

  str = _.isFunction(str) ? str() : str;

  if (!str) return new Handlebars.SafeString('');

  parse = marked.setOptions({
    renderer: renderer,
    gfm: false,
    tables: false,
    breaks: false,
    sanitize: true,
    smartypants: true
  });

  return new Handlebars.SafeString(parse(str));
});


Handlebars.registerHelper('account-avatar', function(name, color) {
  var color = color || ['red', 'green', 'orange', 'purple'][_.random(0, 3)],
      letter = name.charAt(0);

  return new Handlebars.SafeString(
    '<i class="account-avatar" data-color="' + color +'">'+ letter + '</i>'
  );
});

Handlebars.registerHelper('board-avatar', function(board) {
  if (!board.thumbnail_sm_path) {
    return new Handlebars.SafeString('<i class="board-avatar"></i>');
  } else {
    return new Handlebars.SafeString(
      '<img class="board-avatar" src="' + board.thumbnail_sm_path + '"/>'
    );
  }
});

Handlebars.registerHelper('encodeURI', function(value) {
  return new Handlebars.SafeString(window.encodeURI(value));
});

Handlebars.registerHelper('encodeURIComponent', function(value) {
  return new Handlebars.SafeString(window.encodeURIComponent(value));
});
