module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'cards-list list-unstyled clearfix',

  subscriptions: {
    'cardsList:layout': 'triggerLayout'
  },

  addMethod: 'prepend',

  layoutTimer: null,

  itemView: function(model) {
    return require('account/views/' + model.get('type'));
  },

  collection: function() {
    return App.Cards;
  },

  initialize: function() {
    _.bindAll(this, ['layout']);
  },

  triggerLayout: function() {
    this.layoutTimer = _.delay(this.layout, 1);
  },

  layout: function() {
    if (this.collection.isEmpty()) return this;
    if (this.$list.data('masonry')) this.$list.masonry('destroy');

    this.$list.masonry({
      gutter: 15,
      itemSelector: 'li.card'
    });

    return this;
  },

  onRenderItems: function() {
    this.triggerLayout();
  },

  onPrependItem: function() {
    if (!this.isFirstCollectionRender()) this.triggerLayout();
  },

  onUnplug: function() {
    clearTimeout(this.layoutTimer);
    if (this.$list.data('masonry')) this.$list.masonry('destroy');
  }
});

