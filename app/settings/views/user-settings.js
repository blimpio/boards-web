module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'user-settings form-horizontal',

  template: require('settings/templates/user-settings'),

  model: function() {
    return App.User;
  },

  context: function() {
    return _.extend({}, this.personalAccount.attributes, this.model.attributes);
  },

  initialize: function() {
    this.personalAccount = App.Accounts.getPersonalAccount();
  },

  onSubmit: function() {
    var newShortName = this.getAttributeValue('disqus_shortname'),
        currentShortName = this.personalAccount.get('disqus_shortname');

    if (newShortName !== currentShortName && !this.model.validationError) {
      this.personalAccount.save({
        disqus_shortname: newShortName
      });
    }
  }
});

