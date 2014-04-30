module.exports = Z.Region.extend({
  el: 'div.card-detail-left',

  showDetail: function(card) {
    var DetailView;

    if (card.get('type') === 'note') {
      DetailView = require('account/views/note-detail');
    } else if (card.get('type') === 'file') {
      DetailView = require('account/views/file-detail');
    }

    this.setView(DetailView, {model: card}).show();
    return this;
  }
});
