module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'cards-list list-unstyled clearfix',

  subscriptions: {
    'cardsList:layout': 'triggerLayout'
  },

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

  onAppendItem: function() {
    if (!this.isFirstCollectionRender()) this.layout();
  },

  triggerLayout: function() {
    _.delay(this.layout, 10);
  },

  layout: function() {
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
  }
});

