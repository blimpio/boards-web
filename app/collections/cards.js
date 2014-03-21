module.exports = Zeppelin.Collection.extend({
  name: 'Cards',

  url: '/api/cards/',

  model: require('models/card'),

  subscriptions: {
    'card:selected': 'onCardSelected'
  },

  comparator: function(model) {
    return -model.get('position');
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
  },

  addStack: function(stack) {
    var model = this.add(stack);

    model.save().done(_.bind(function() {
      _.forEach(stack.cards, function(id) {
        this.get(id).set('stack', model.id);
      }, this);
    }, this));

    return model;
  }
});
