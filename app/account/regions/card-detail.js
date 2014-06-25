module.exports = Z.Region.extend({
  el: 'div.card-detail-left',

  showDetail: function(card) {
    var DetailView = require('account/views/' + card.get('type') + '-detail');
    this.setView(DetailView, {model: card}).show();
    return this;
  }
});
