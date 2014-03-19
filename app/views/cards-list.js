module.exports = Zeppelin.CollectionView.extend({
  name: 'CardsList',

  el: 'div.cards',

  list: 'ol.cards-list',

  template: require('templates/cards'),

  collection: App.Cards,

  itemView: require('views/card'),

  views: {
    createForm: require('views/create-card'),
    fileUploader: require('views/file-uploader')
  },

  subscriptions: {
    'card:creating': 'showCreateMode',
    'card:creating:cancel': 'hideCreateMode',
    'card:uploading': 'hideCreateMode',
    'card:created': 'addCard',
  },

  showCreateMode: function(type) {
    this.$el.addClass('is-creating-' + type);
    return this;
  },

  hideCreateMode: function() {
    this.$el.removeClass('is-creating-note is-creating-file');
    return this;
  },

  addCard: function(card) {
    this.hideCreateMode().collection.add(card);
    return this;
  },

  onRenderCollection: function() {
    this.masonry = new Masonry(this.$list[0], {
      gutter: 15,
      itemSelector: '.card'
    });
  }
});
