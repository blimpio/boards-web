module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards | Your accounts.',

  layouts: {
    main: require('accounts/layouts/main')
  },

  initialize: function() {
    this.getLayout('main').render().getRegion('accountsList').show();
    App.Accounts.fetch({reset: true});
  }
});
