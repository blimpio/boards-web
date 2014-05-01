module.exports = Zeppelin.Controller.extend({
  title: 'Forgot your password - Blimp Boards',

  layouts: {
    main: require('forgot-password/layouts/main')
  },

  initialize: function() {
    this.getLayout('main').render().getRegion('form').show();
  }
});
