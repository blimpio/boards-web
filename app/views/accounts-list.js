module.exports = Zeppelin.View.extend({
  el: 'ol.accounts__list',

  name: 'AccountsList',

  template: require('templates/accounts-list'),

  context: function() {
    return this.model.getPresenters(['accounts']);
  }
});
