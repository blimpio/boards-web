module.exports = Zeppelin.CollectionView.extend({
  name: 'CardsList',

  el: 'div.cards',

  list: 'ol.cards-list',

  template: require('templates/cards'),

  collection: App.Cards,

  itemView: require('views/card'),

  views: {
    createForm: require('views/create-card')
  },

  subscriptions: {
    'card:creating': 'showCreateMode',
    'card:creating:cancel': 'hideCreateMode',
    'card:created': 'addCard'
  },

  showCreateMode: function() {
    this.$el.addClass('is-creating');
    return this;
  },

  hideCreateMode: function() {
    this.$el.removeClass('is-creating');
    return this;
  },

  addCard: function(card) {
    this.hideCreateMode().collection.add(card);
    return this;
  }
});
