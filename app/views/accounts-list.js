module.exports = Zeppelin.CollectionView.extend({
  el: 'ol.accounts__list',

  name: 'AccountsList',

  list: 'ol.accounts__list',

  itemView: require('views/accounts-list-item')
});
