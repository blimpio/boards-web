_.mixin({'asset': function(path) {
  return App.STATIC_URL + (path || '');
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
  var parser,
      renderer = new marked.Renderer();

  renderer.link = function(href, title, text) {
    if (title) {
      return '<a href="' + href + '" title="' + title + '" target="_blank">' + text + '</a>';
    } else {
      return '<a href="' + href + '" target="_blank">' + text + '</a>';
    }
  };

  renderer.image = function(href, title, text) {
    href = App.CAMO_URL + '?url=' + href;

    if (title) {
      return '<img src="' + href + '" title="' + title + '" alt="' + text + '">';
    } else {
      return '<img src="' + href + '" alt="' + text + '">';
    }
  };

  var parser = marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    sanitize: true,
    renderer: renderer,
    smartypants: true
  });

  return parser(text);
}});

_.mixin({'isLetterKey': function(key) {
  var notAllowed = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34,
  35, 36, 37, 38, 39, 40, 45, 46];

  return _.indexOf(notAllowed, key) === -1;
}});

_.mixin({'insertAtCursor': function(field, text) {
  var val, range, caretPos, selStart;

  field = Z.Util.isJqueryObject(field) ? field[0] : field;

  if (document.selection) {
    range = document.selection.createRange();

    if (!range || range.parentElement() != field) {
      field.focus();
      range = field.createTextRange();
      range.collapse(false);
    }

    range.text = text;
    range.collapse(false);
    range.select();
  } else {
    field.focus();
    val = field.value;
    selStart = field.selectionStart;
    caretPos = selStart + text.length;
    field.value = val.slice(0, selStart) + text + val.slice(field.selectionEnd);
    field.setSelectionRange(caretPos, caretPos);
  }
}});

$(document).on('click', '[data-route=true]', function(event) {
  if (!event.metaKey) {
    event.preventDefault();
    Backbone.Events.trigger('router:navigate', $(this).attr('href'));
  }
});

Handlebars.registerHelper('asset-url', function(path) {
  return new Handlebars.SafeString(App.STATIC_URL);
});

Handlebars.registerHelper('markdown', function(str) {
  str = _.isFunction(str) ? str() : str;
  if (!str) return new Handlebars.SafeString('');
  return new Handlebars.SafeString(_.markdown(str));
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

Handlebars.registerHelper('to-route', function(url) {
  url = url ? url.replace(window.location.origin, '') : '';
  return new Handlebars.SafeString(url);
});

Handlebars.registerHelper('checked', function (value) {
  return value == true ? ' checked ' : '';
});
