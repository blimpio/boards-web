module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'invite-collaborators-form',

  template: require('account/templates/invite-collaborators-form'),

  invitationRow: require('account/templates/invite-collaborator-row'),

  events: {
    'click [data-action=cancel]': 'reset',
    'click button[data-permission]': 'onChangePermission',
    'click [data-action=addInvitationRow]': 'addInvitationRow',
    'click [data-action=removeCollaborator]': 'onRemoveInvitationRowClick'
  },

  elements: {
    invitationRows: 'div.invite-collaborator-rows'
  },

  saveOnSubmit: false,

  submit: function() {
    var error = 'One or more emails are not valid.',
        emails = [],
        invitees = this.getAttributeValues().invitee,
        hasError = false,
        invitations = [],
        $permissions;

    invitees = _.isArray(invitees) ? invitees : [invitees];

    _.forEach(invitees, function(invitee, index) {
      if (invitee && !Z.Validations.isEmail(invitee)) {
        hasError = true;
        $(this.getAttributeElement('invitee').get(index))
          .addClass(this.errorClass);
      } else if (invitee) {
        emails.push(invitee);
      }
    }, this);

    if (!hasError) {
      $permissions = this.$('div.collaborator-permissions');

      _.forEach(emails, function(email, index) {
        invitations.push({
          email: email,
          board: this.options.board,
          permission: $($permissions.get(index)).data('permission')
        });
      }, this);

      App.Collaborators.invite(invitations);
      this.reset();
    }
  },

  reset: function() {
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
      .text('Can ' + (permission === 'write' ? 'edit' : 'read'));
  }
});

