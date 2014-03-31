module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards | Organize anything, visually.',

  layouts: {
    main: require('home/layouts/main')
  },

  initialize: function() {
    this.getLayout('main').render().getRegion('signupRequest').show();
  }
});
