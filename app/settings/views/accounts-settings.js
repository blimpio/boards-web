module.exports = Zeppelin.CompositeView.extend({
  views: {
    accountForm: require('settings/views/account-settings')
  },

  template: require('settings/templates/accounts-settings'),

  elements: {
    accountsChooser: 'div.accounts-chooser-wrapper',
    accountSettings: 'div.account-settings-wrapper'
  },

  events: {
    'change select.accounts-chooser-select': 'onAccountChange'
  },

  initialize: function() {
    this.listenTo(App.Accounts, 'change', 'render');
  },

  context: function() {
    return {
      accounts: App.Accounts.getUnselectedAccounts(),
      currentAccount: App.Accounts.current.toJSON()
    }
  },

  onRender: function() {
    this.getElement('accountSettings').html(
      this.getView('accountForm').render().el
    );
  },

  onAccountChange: function(event) {
    this.getView('accountForm')
      .setModel(App.Accounts.get(event.currentTarget.value))
      .render();
  }
});
