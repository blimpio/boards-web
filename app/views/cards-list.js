module.exports = Zeppelin.CollectionView.extend({
  name: 'CardsList',

  el: 'div.cards',

  template: require('templates/cards'),

  list: 'ol.cards-list',

  collection: App.Cards,

  itemView: require('views/card'),

  subscriptions: {
    'card:creating': 'showCreateMode',
    'card:creating:cancel': 'hideCreateMode',
    'card:created': 'addCard'
  },

  onRender: function() {
    this.addChild(_.createView('create-card', {
      el: 'form.create-card'
    }), 'createForm');

    return this;
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
  },

  onAdd: function(card) {
    if (!this.isFirstRender) this.appendItem(this.renderItem(card));
    return this;
  },
});
