module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'invite-collaborators-form',

  template: require('account/templates/invite-collaborators-form'),

  collaboratorSuggestions: require('account/templates/collaborator-suggestions'),

  suggestions: [],

  events: function() {
    return {
      'keyup [name=invitee]': _.debounce(this.onKeyup, 500),
      'keydown [name=invitee]': 'onInputKeydown',
      'click a[data-permission]': 'onChangePermission',
      'click a.collaborator-suggestion': 'onSuggestionClick',
      'keydown div.collaborator-suggestions': 'onSuggestionKeydown'
    };
  },

  elements: {
    addBtn: '[data-action=add]',
    permission: '[data-permission]'
  },

  saveOnSubmit: false,

  initialize: function() {
    _.bindAll(this, ['onBodyClick', 'onKeyup']);
  },

  submit: function() {
    var error = 'One or more emails are not valid.',
        $invitee = this.getAttributeElement('invitee'),
        hasError = false,
        inviteeId = $invitee.data('id'),
        invitation = {},
        inviteeData = {},
        inviteeEmail = $.trim($invitee.val());

    if (inviteeId) {
      inviteeData = _.where(this.suggestions, {id: inviteeId})[0];

      invitation = {
        user: inviteeId,
        board: this.options.board,
        user_data: inviteeData,
        permission: this.getElement('permission').data('permission')
      };
    } else if (inviteeEmail) {
      if (Z.Validations.isEmail(inviteeEmail)) {
        invitation = {
          email: inviteeEmail,
          board: this.options.board,
          user_data: {
            email: inviteeEmail
          },
          permission: this.getElement('permission').data('permission')
        };
      } else {
        hasError = true;
        $invitee.addClass(this.errorClass);
      }
    }

    if (!hasError) {
      this.reset();
      this.focus();
      App.BoardCollaborators.invite([invitation]).done();
    }
  },

  reset: function() {
    this.hideSuggestions();
    Zeppelin.FormView.prototype.reset.apply(this, arguments);
    return this;
  },

  searchSuggestions: function(query) {
    return $.getJSON(App.API_URL + '/autocomplete/users/', {
      search: query
    });
  },

  populateSuggestions: function($container, suggestions) {
    this.suggestions = suggestions;

    $container.find('div.collaborator-suggestions-list')
      .html(this.collaboratorSuggestions({
        collaborators: suggestions
      })).end().show();

    $('body').on('click.collaborator-suggestions', _.bind(function(event) {
      event.stopImmediatePropagation();
      this.onBodyClick(event);
    }, this));

    return this;
  },

  hideSuggestions: function() {
    $('div.collaborator-suggestions').hide();
    $('body').off('click.collaborator-suggestions');
    return this;
  },

  onBodyClick: function(event) {
    var $target = $(event.target);

    if (!$target.is('input[name=invitee]') &&
    !$target.is('div.collaborator-suggestions') &&
    !$target.parents('div.collaborator-suggestions').length) {
      this.hideSuggestions();
    }
  },

  onKeyup: function(event) {
    var $el = $(event.currentTarget),
        self = this,
        value = $el.val(),
        $container = $el.parent().nextAll('div.collaborator-suggestions');

    if (event.keyCode === 40) return;

    if (!value || value.match(/@/)) {
      this.hideSuggestions();
      $el.removeClass('is-loading');
    } else {
      this.searchSuggestions(value).done(function(response) {
        if (response.length) {
          self.populateSuggestions($container, response);
        } else {
          self.hideSuggestions();
        }

        $el.removeClass('is-loading');
      }).fail(function() {
        self.hideSuggestions();
        $el.removeClass('is-loading');
      });
    }
  },

  onInputKeydown: function(event) {
    var $el = $(event.currentTarget),
        $suggestions = $el.parent().nextAll('div.collaborator-suggestions');

    if (event.keyCode === 40 && $suggestions.is(':visible')) {
      $suggestions.find('a.collaborator-suggestion').first().focus();
      _.delay(function() {
        $suggestions.scrollTop(0);
      }, 50);
    } else {
      if (!$el.val().match(/@/)) $el.addClass('is-loading');
    }
  },

  onSuggestionKeydown: function(event) {
    var $el = $(event.currentTarget);

    if (event.keyCode === 40) {
      $el.find('a.collaborator-suggestion:focus').next().focus();
    } else if (event.keyCode === 38) {
      $el.find('a.collaborator-suggestion:focus').prev().focus();
    } else if (event.keyCode === 27) {
      this.hideSuggestions();
    } else if (event.keyCode === 13) {
      $el.find('a.collaborator-suggestion:focus').click();
    }

    event.preventDefault();
  },

  onSuggestionClick: function(event) {
    var $suggestion = $(event.currentTarget);

    event.preventDefault();

    this.getAttributeElement('invitee')
      .val($suggestion.data('name'))
      .data('id', $suggestion.data('id'));

    this.submit();
  },

  onChangePermission: function(event) {
    var permission = $(event.currentTarget).data('permission');

    event.preventDefault();

    this.getElement('permission')
      .attr('data-permission', permission)
      .find('span.collaborator-permissions-toggle-text')
      .text('Can ' + (permission === 'write' ? 'edit' : 'view'));
  }
});

