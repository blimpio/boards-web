module.exports = Zeppelin.View.extend({
  name: 'Header',

  el: 'div.header',

  template: require('templates/header'),

  views: {
    accounts: require('views/accounts-dropdown')
  },

  model: App.User,

  context: function() {
    return this.model.getPresenters(['isSignedIn']);
  }
});
