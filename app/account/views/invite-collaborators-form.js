module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'invite-collaborators-form',

  template: require('account/templates/invite-collaborators-form'),

  invitationRow: require('account/templates/invite-collaborator-row'),

  collaboratorSuggestions: require('account/templates/collaborator-suggestions'),

  events: function() {
    return {
      'keyup [name=invitee]': _.debounce(this.onKeyup, 500),
      'keydown [name=invitee]': 'onInputKeydown',
      'click [data-action=cancel]': 'reset',
      'click button[data-permission]': 'onChangePermission',
      'click a.collaborator-suggestion': 'onSuggestionClick',
      'keydown div.collaborator-suggestions': 'onSuggestionKeydown',
      'click [data-action=addInvitationRow]': 'addInvitationRow',
      'click [data-action=removeCollaborator]': 'onRemoveInvitationRowClick'
    };
  },

  elements: {
    sendBtn: '[data-action=send]',
    invitationRows: 'div.invite-collaborator-rows'
  },

  saveOnSubmit: false,

  initialize: function() {
    _.bindAll(this, ['onBodyClick', 'onKeyup']);
  },

  submit: function() {
    var $rows = this.$('div.invite-collaborator-row'),
        error = 'One or more emails are not valid.',
        hasError = false,
        invitations = [];

    _.forEach($rows, function(row) {
      var $row = $(row),
          $input = $row.find('input[name=invitee]'),
          inputId = $input.data('id'),
          inputValue = $input.val(),
          collaborator;

      if (inputId) {
        invitations.push({
          user: inputId,
          board: this.options.board,
          permission: $row.find('div.collaborator-permissions').data('permission')
        });
      } else if (inputValue) {
        if (Z.Validations.isEmail(inputValue)) {
          invitations.push({
            email: inputValue,
            board: this.options.board,
            permission: $row.find('div.collaborator-permissions').data('permission')
          });
        } else {
          hasError = true;
          $input.addClass(this.errorClass);
        }
      }
    }, this);

    if (!hasError) {
      this.reset();
      this.getElement('sendBtn').text('Sending...');
      App.BoardCollaborators.invite(invitations).done(_.bind(function() {
        this.getElement('sendBtn').text('Send');
      }, this));
    }
  },

  reset: function() {
    this.hideSuggestions();
    this.getElement('invitationRows').children().filter(':not(:first-child)').remove();
    Zeppelin.FormView.prototype.reset.apply(this, arguments);
    return this;
  },

  addInvitationRow: function() {
    this.getElement('invitationRows').append(this.invitationRow());
    return this;
  },

  removeInvitationRow: function($row) {
    if ($row.find('[name="invitee"]').val()) {
      if (window.confirm('Are you sure you want to remove this invitation?')) {
        $row.remove();
      }
    } else {
      $row.remove();
    }

    return this;
  },

  searchSuggestions: function(query) {
    return $.getJSON('/api/autocomplete/users/', {
      search: query
    });
  },

  populateSuggestions: function($container, suggestions) {
    $container.find('div.collaborator-suggestions-list')
      .html(this.collaboratorSuggestions({
        collaborators: suggestions
      }))
    .end().show();

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
    var $el = $(event.currentTarget);

    event.preventDefault();

    $el.parents('div.invite-collaborator-row')
      .find('input[name=invitee]')
      .val($el.data('name'))
      .data('id', $el.data('id'));

    this.hideSuggestions();
  },

  onRemoveInvitationRowClick: function(event) {
    this.removeInvitationRow(
      $(event.currentTarget).parents('div.invite-collaborator-row')
    );
  },

  onChangePermission: function(event) {
    var $el = $(event.currentTarget),
        permission = $el.data('permission');

    $el.parents('div.collaborator-permissions')
      .attr('data-permission', permission)
      .find('span.collaborator-permissions-toggle-text')
      .text('Can ' + (permission === 'write' ? 'edit' : 'view'));
  }
});

