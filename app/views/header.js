module.exports = Zeppelin.View.extend({
  el: 'div.header',

  name: 'Header',

  template: require('templates/header'),

  initAccountsDropdown: function() {
    this.addChild(_.createView('accounts-dropdown'), 'accounts').render();
    return this;
  },

  context: function() {
    return this.model.getPresenters(['isSignedIn']);
  }
});
