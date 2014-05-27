module.exports = Zeppelin.Controller.extend({
  title: 'Your accounts - Blimp Boards',

  layouts: {
    main: require('accounts/layouts/main')
  },

  initialize: function() {
    _.bindAll(this, ['onAccountsFetch']);
    App.Accounts.fetch({ reset: true }).done(this.onAccountsFetch);
  },

  onAccountsFetch: function() {
    if (App.Accounts.getDisplayableAccounts() > 1) {
      this.getLayout('main')
        .render()
        .showAccounts()
        .toggleLoadingState();
    } else {
      this.broadcast('router:navigate', '/' + App.Accounts.getPersonalAccount().get('slug') + '/');
    }
  }
});
