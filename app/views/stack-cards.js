module.exports = Zeppelin.CollectionView.extend({
  name: 'StackCardsList',

  collection: App.Cards,

  itemView: require('views/card'),

  arrange: function() {
    this.masonry = new Masonry(this.$list[0], {
      gutter: 15,
      isFitWidth: true,
      columnWidth: 220,
      itemSelector: '.card'
    });
  }
});
