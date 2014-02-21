module.exports = Zeppelin.View.extend({
  el: 'div.header',

  name: 'Header',

  template: require('templates/header'),

  context: function() {
    return this.model.getPresenters(['isSignedIn']);
  },

  onRender: function() {
    this.initAccountsDropdown()
  },

  initAccountsDropdown: function() {
    this.addChild(_.createView('accounts-dropdown'), 'accounts').render();
    return this;
  }
});
