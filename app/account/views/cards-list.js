module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'cards-list list-unstyled clearfix',

  subscriptions: {
    'cardsList:layout': 'triggerLayout'
  },

  addMethod: 'prepend',

  itemView: function(model) {
    return require('account/views/' + model.get('type'));
  },

  collection: function() {
    return App.Cards;
  },

  initialize: function() {
    _.bindAll(this, ['layout']);
  },

  onRenderItems: function() {
    this.triggerLayout();
  },

  onPrependItem: function() {
    if (!this.isFirstCollectionRender()) this.triggerLayout();
  },

  triggerLayout: function() {
    _.delay(this.layout, 1);
  },

  layout: function() {
    if (this.collection.isEmpty()) return this;
    if (this.$list.data('masonry')) this.$list.masonry('destroy');

    this.$list.masonry({
      gutter: 15,
      itemSelector: 'li.card'
    });

    return this;
  }
});

