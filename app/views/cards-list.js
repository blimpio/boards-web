module.exports = Zeppelin.CollectionView.extend({
  name: 'CardsList',

  el: 'div.cards',

  list: 'ol.cards-list',

  template: require('templates/cards'),

  collection: App.Cards,

  itemView: function(model) {
    if (model.get('type') === 'stack') {
      return require('views/stack');
    } else {
      return require('views/card');
    }
  },

  views: {
    createForm: require('views/create-card'),
    fileUploader: require('views/file-uploader')
  },

  subscriptions: {
    'card:creating': 'showCreateMode',
    'card:creating:cancel': 'hideCreateMode',
    'card:uploading': 'hideCreateMode',
    'card:created': 'addCard',
    'card:append': 'appendCard',
    'new:stack': 'createStack',
    'cards:layout': 'arrange'
  },

  showCreateMode: function(type) {
    this.$el.addClass('is-creating-' + type);
    return this;
  },

  hideCreateMode: function() {
    this.$el.removeClass('is-creating-note is-creating-file');
    return this;
  },

  appendCard: function(card) {
    this.appendItem(this.collection.get(card));
    return this;
  },

  addCard: function(card) {
    this.hideCreateMode().collection.add(card);
    return this;
  },

  arrange: function() {
    this.masonry = new Masonry(this.$list[0], {
      gutter: 15,
      isFitWidth: true,
      columnWidth: 220,
      itemSelector: '.card'
    });
  },

  onRenderCollection: function() {
    this.arrange();
  },

  createStack: function(ids, elements) {
    var stackModel, stackItem;

    if (!ids) return this;

    stackModel = this.collection.addStack({
      type: 'stack',
      name: 'Card Stack',
      board: App.Cache.get('current_board'),
      cards: ids
    }, {silent: true});

    this.renderItem(stackModel);
    stackItem = this.getItem(stackModel);

    if (elements) {
      _.last(elements).after(stackItem.el);
      _.each(elements, function(element) {
        element.remove();
      });
    } else {
      this.$list.append(stackItem);
    }

    this.arrange();
  }
});
