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
    this.$parent = $('div.content');
    _.bindAll(this, ['layout']);
  },

  onRenderItems: function() {
    this.wall = new freewall(this.$list);
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

    this.wall.reset({
      delay: 0,
      cellW: 222,
      cellH: 222,
      animate: false,
      selector: 'li.card',
      onResize: _.bind(function() {
        this.wall.fitWidth();
      }, this)
    });

    this.wall.fitWidth(this.$parent.width());

    return this;
  }
});

