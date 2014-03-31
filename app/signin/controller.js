module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards | Sign in.',

  layouts: {
    main: require('signin/layouts/main')
  },

  initialize: function() {
    this.getLayout('main').render().getRegion('form').show();
  }
});
