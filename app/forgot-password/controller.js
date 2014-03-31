module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards | Sign in.',

  layouts: {
    main: require('forgot-password/layouts/main')
  },

  initialize: function() {
    this.getLayout('main').render().getRegion('form').show();
  }
});
