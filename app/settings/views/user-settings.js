module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'user-settings form-horizontal',

  template: require('settings/templates/user-settings'),

  events: function() {
    return {
      'input input': _.debounce(this.onChange, 200),
      'click [data-action=cancel]': 'onCancel'
    };
  },

  elements: {
    actions: 'div.settings-modal-actions',
    saveBtn: 'button[data-action=save]'
  },

  model: function() {
    return App.User;
  },

  context: function() {
    return _.extend({}, this.personalAccount.attributes, this.model.attributes);
  },

  initialize: function() {
    _.bindAll(this, ['onChange']);
    this.personalAccount = App.Accounts.getPersonalAccount();
  },

  onChange: function() {
    var changes = this.diff(),
        changesLength = _.size(changes);

    if (changesLength) {
      if (changesLength === 1 && changes.disqus_shortname !== undefined) {
        if (changes.disqus_shortname !==
        this.personalAccount.get('disqus_shortname')) {
          this.getElement('actions').show();
        } else {
          this.getElement('actions').hide();
        }
      } else {
        this.getElement('actions').show();
      }
    } else {
      this.getElement('actions').hide();
    }
  },

  onSync: function() {
    var self = this;

    _.delay(function() {
      self.getElement('actions').hide();
      self.getElement('saveBtn').text('Save');
    }, 200);
  },

  onValidationSuccess: function() {
    this.getElement('saveBtn').text('Saving changes...');
    this.listenToOnce(this.model, 'sync', this.onSync);
  },

  onSubmit: function() {
    var newShortName = this.getAttributeValue('disqus_shortname'),
        currentShortName = this.personalAccount.get('disqus_shortname');

    if (newShortName !== currentShortName && !this.model.validationError) {
      this.personalAccount.save({
        disqus_shortname: newShortName
      });
    }
  },

  onCancel: function() {
    this.reset();
    this.getElement('actions').hide();
  }
});

