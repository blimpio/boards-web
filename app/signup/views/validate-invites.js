module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'signup-validate-invites',

  template: require('signup/templates/validate-invites'),

  rowTemplate: require('signup/templates/invitation-row'),

  domainTemplate: require('signup/templates/invitation-domain'),

  events: {
    'click button[data-action=skip]': 'skip',
    'change div.invitation-row select': 'addDomainInput',
    'click button[data-action=addRow]': 'addRow',
    'click button[data-action=removeRow]': 'removeRow'
  },

  elements: {
    invitations: 'div.invitations',
    invitationRows: 'div.invitation-row'
  },

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  addRow: function() {
    this.getElement('invitations').append(this.renderTemplate(this.rowTemplate));
    this.$('input.invitation-field').last().focus();
  },

  removeRow: function(event) {
    var $btn = $(event.currentTarget);
        $row = $btn.parents('div.invitation-row'),
        $field = $row.find('input.invitation-field'),
        deleteMessage = 'Do you want to delete this row and it\'s data?';

    if ($field.val()) {
      if (window.confirm(deleteMessage)) $row.remove();
    } else {
      $row.remove();
    }
  },

  addDomainInput: function(event) {
    var $select = $(event.currentTarget);

    if ($select.val() === 'other') {
      $select.after(this.renderTemplate(this.domainTemplate))
        .next().focus()
        .end().remove();
    }

    return this;
  },

  submit: function() {
    var $error = this.getAttributeErrorElement('invite_emails'),
        invitations = [],
        invitationsError = false;

    _.forEach(this.getElement('invitationRows'), function(el) {
      var $el = $(el),
          invitation = $el.find('input.invitation-field').val();

      if (invitation) {
        if ($el.find('input.invitation-domain').length) invitation += '@';
        invitation += $el.find('[data-domain-source=true]').val();
        invitations.push(invitation);
      }
    }, this);

    if (invitations.length) {
      _.forEach(invitations, function(invitation) {
        if (!Z.Validations.isEmail(invitation)) {
          invitationsError = true;
          $error.show().text('One or more emails are invalid.');
          return false;
        }
      }, this);
    }

    if (!invitationsError) {
      this.getAttributeErrorElement('invite_emails').hide();
      if (invitations.length) this.model.set('invite_emails', invitations)
      this.model.set('username', this.model.previous('username'));
      this.model.updateSignupStep('validate-username');
      this.broadcast('signup:stepPassed');
    }
  },

  skip: function(event) {
    this.getAttributeErrorElement('invite_emails').hide();
    this.model.updateSignupStep('validate-username');
    this.broadcast('signup:stepPassed');
  }
});

