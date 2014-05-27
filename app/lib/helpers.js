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

Handlebars.registerHelper('icon-add', function() {
  var icon = '<svg class="icon-add svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g fill="#000" class="svg-icon-color" fill-rule="evenodd"><path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zM10.886 7h-1.886v-1.884c0-.53-.469-.96-1-.961-.531.001-1 .431-1 .961v1.884h-1.882c-.53 0-.96.469-.961 1 .001.531.431 1 .961 1h1.882v1.884c0 .53.47.961 1 .961.531-.001 1-.431 1-.961v-1.884h1.886c.53 0 .96-.469.961-1 0-.53-.431-1-.961-1z"/></g></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-arrow-left', function() {
  var icon = '<svg class="icon-arrow-left svg-icon-wrapper" width="7" height="11" viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><path d="M5.463 10.851c.189.199.496.199.684 0l.683-.717c.189-.197.189-.518 0-.715l-3.295-3.405 3.322-3.434c.189-.198.189-.519 0-.716l-.683-.717c-.188-.197-.494-.197-.684 0l-4.35 4.508c-.188.198-.188.519 0 .717l4.323 4.479z" fill="#000" class="svg-icon-color" fill-rule="evenodd"/></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-bell', function() {
  var icon = '<svg class="icon-bell svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M15 9.305c0-3.322-2.125-6.118-5.03-7.006l.03-.299c0-1.105-.896-2-2-2s-2 .895-2 2l.03.299c-2.905.888-5.03 3.683-5.03 7.006v2.695h-.5c-.276 0-.5.224-.5.5v1c0 .276.224.5.5.5h5.5c0 1.105.896 2 2 2s2-.895 2-2h5.5c.276 0 .5-.224.5-.5v-1c0-.276-.224-.5-.5-.5h-.5v-2.695zm-12 2.695v-2.695c0-2.926 2.243-5.305 5-5.305s5 2.379 5 5.305v2.695h-10z" fill="#000" class="svg-icon-color" fill-rule="evenodd"/></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-card', function() {
  var icon = '<svg class="icon-card svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1 16h14c.55 0 1-.45 1-1v-14c0-.55-.45-1-1-1h-14c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1zm1-14h12v10h-12v-10z" fill="#000" class="svg-icon-color" fill-rule="evenodd"/></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-collaborate', function() {
  var icon = '<svg class="icon-collaborate svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.094 5.832c.557-.62.906-1.432.906-2.332 0-1.934-1.566-3.5-3.5-3.5s-3.5 1.566-3.5 3.5c0 .9.349 1.712.906 2.332-.375.266-.7.592-.979.958-.327-1.593-1.737-2.79-3.427-2.79-1.934 0-3.5 1.566-3.5 3.5 0 .9.349 1.712.906 2.332-1.15.814-1.906 2.15-1.906 3.668v1.5c0 .553.447 1 1 1h7c.553 0 1-.447 1-1v-1.5c0-.93-.172-1.219-.275-1.5h6.275c.553 0 1-.447 1-1v-1.5c0-1.518-.756-2.854-1.906-3.668zm-7.094 8.168h-5v-.5c0-1.379 1.121-2.5 2.5-2.5s2.5 1.121 2.5 2.5v.5zm7-4h-5v-.5c0-1.379 1.121-2.5 2.5-2.5s2.5 1.121 2.5 2.5v.5zm-8-2.5c0 .828-.671 1.5-1.5 1.5s-1.5-.672-1.5-1.5.671-1.5 1.5-1.5 1.5.672 1.5 1.5zm7-4c0 .828-.671 1.5-1.5 1.5s-1.5-.672-1.5-1.5.671-1.5 1.5-1.5 1.5.672 1.5 1.5z" fill="#000" class="svg-icon-color" fill-rule="evenodd"/></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-delete', function() {
  var icon = '<svg class="svg-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g fill="#000" class="svg-color" fill-rule="evenodd"><path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zM10.721 5.281c-.376-.375-.984-.375-1.359 0l-1.36 1.36-1.359-1.36c-.375-.375-.983-.375-1.359 0-.375.376-.375.984 0 1.359l1.359 1.36-1.36 1.359c-.375.375-.375.984 0 1.359.376.375.984.375 1.359 0l1.359-1.359 1.359 1.359c.375.375.983.375 1.359 0 .375-.375.375-.984 0-1.359l-1.358-1.359 1.359-1.359c.376-.375.376-.984.001-1.36z"/></g></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-download', function() {
  var icon = '<svg class="icon-download svg-icon-wrapper" width="16" height="14" viewBox="0 0 16 14" xmlns="http://www.w3.org/2000/svg"><g fill="#000" class="svg-icon-color" fill-rule="evenodd"><path d="M7.677 9.822c.179.234.468.238.646.004l2.587-3.326c.179-.236.082-.5-.215-.5h-1.695v-5.5c0-.275-.224-.5-.5-.5h-1c-.276 0-.5.225-.5.5v5.5h-1.695c-.297 0-.394.265-.215.5l2.587 3.322zM15.5 12h-15c-.276 0-.5.224-.5.5v1c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-1c0-.276-.224-.5-.5-.5z"/></g></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-search', function() {
  var icon = '<svg class="icon-search svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M15.707 14.293l-3.112-3.092-.006-.004c.882-1.172 1.411-2.622 1.411-4.197 0-3.859-3.141-7-7-7s-7 3.141-7 7 3.141 7 7 7c1.575 0 3.025-.529 4.196-1.41l.004.006 3.093 3.111c.195.195.451.293.707.293.256 0 .512-.098.707-.293.391-.391.391-1.023 0-1.414zm-8.707-2.293c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" fill="#000" class="svg-icon-color" fill-rule="evenodd"/></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-share', function() {
  var icon = '<svg class="icon-share svg-icon-wrapper" width="16" height="14" viewBox="0 0 16 14" xmlns="http://www.w3.org/2000/svg"><g fill="#000" class="svg-icon-color" fill-rule="evenodd"><path d="M5.2 9.522c.071.268.222.268.326.012.896-2.201 2.673-4.467 5.474-3.533v1.374c0 .621.375.812.826.422l4.006-3.446c.227-.194.225-.509-.002-.703l-4.006-3.448c-.449-.387-.824-.197-.824.424v1.377c-3.313 0-6 2.687-6 6 0 .526.071 1.036.2 1.521zM15.611 6.288l-1.223.987c-.214.174-.388.538-.388.815v3.911h-12v-7h2.091c.276 0 .583-.209.703-.458.191-.4.415-.782.669-1.144.158-.225.076-.398-.2-.398h-4.263c-.553 0-1 .447-1 1v9c0 .553.447 1 1 1h14c.553 0 1-.447 1-1v-6.527c0-.277-.174-.36-.389-.186z"/></g></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-sidebar-close', function() {
  var icon = '<svg class="icon-sidebar-close svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g fill="#000" class="svg-icon-color" fill-rule="evenodd"><path d="M15 0h-14c-.553 0-1 .447-1 1v14c0 .553.447 1 1 1h14c.553 0 1-.447 1-1v-14c0-.553-.447-1-1-1zm-11 14h-2v-12h2v12zm10 0h-8v-12h8v12zM12.47 7h-2.47v-1.719c0-.301-.214-.371-.437-.158l-2.409 2.492c-.222.213-.194.557.027.77l2.369 2.492c.222.213.45.143.45-.158v-1.719h2.47c.276 0 .53-.223.53-.5v-1c0-.275-.254-.5-.53-.5z"/></g></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-sidebar-open', function() {
  var icon = '<svg class="icon-sidebar-open svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g fill="#000" class="svg-icon-color" fill-rule="evenodd"><path d="M15 0h-14c-.553 0-1 .447-1 1v14c0 .553.447 1 1 1h14c.553 0 1-.447 1-1v-14c0-.553-.447-1-1-1zm-11 14h-2v-12h2v12zm10 0h-8v-12h8v12zM7.525 9h2.475v1.719c0 .3.212.371.435.158l2.407-2.493c.223-.212.193-.556-.027-.769l-2.366-2.493c-.223-.212-.449-.142-.449.159v1.719h-2.475c-.276 0-.525.223-.525.5v1c0 .275.249.5.525.5z"/></g></svg>';
  return new Handlebars.SafeString(icon);
});

Handlebars.registerHelper('icon-star', function() {
  var icon = '<svg class="icon-star svg-icon-wrapper" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M12.427 15.898l-4.427-2.436-4.427 2.436c-.443.244-.735.031-.653-.478l.848-5.172-3.561-3.634c-.356-.363-.242-.721.256-.795l4.914-.747 2.228-4.725c.219-.464.573-.464.792 0l2.227 4.725 4.914.747c.498.074.612.432.256.795l-3.561 3.634.848 5.172c.081.509-.211.723-.654.478zm-9.009-8.642l2.303 2.351-.539 3.286 2.818-1.549 2.817 1.549-.539-3.286 2.303-2.351-3.181-.484-1.4-2.969-1.4 2.97-3.182.483z" fill="#000" class="svg-icon-color" fill-rule="evenodd"/></svg>';
  return new Handlebars.SafeString(icon);
});
