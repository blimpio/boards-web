module.exports = Zeppelin.Controller.extend({
  title: 'Your accounts - Blimp Boards',

  layouts: {
    main: require('accounts/layouts/main')
  },

  initialize: function() {
    this.getLayout('main').render().getRegion('accountsList').show();
    App.Accounts.fetch({reset: true});
  }
});
