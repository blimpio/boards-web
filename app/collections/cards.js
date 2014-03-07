module.exports = Zeppelin.Collection.extend({
  name: 'Cards',

  url: '/api/cards/',

  model: require('models/card'),

  subscriptions: {
    'card:selected': 'onCardSelected'
  },

  setCurrent: function(slug) {
    this.current = slug ? this.findWhere({slug: slug}) : this.first();
    this.current = this.current && this.current.id ? this.current.id : null;
    App.Cache.set('current_card', this.current).saveCache();
    return this;
  },

  getCurrent: function() {
    return this.current ? this.get(this.current) : null;
  },

  onCardSelected: function(card) {
    if (card) this.setCurrent(card.get('slug'));
    return this;
  },

  hasCardsFromBoard: function(id) {
    return _.size(this.findWhere({board: id})) > 0;
  }
});
