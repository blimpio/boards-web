var NoteDetail = require('account/views/note-detail'),
    FileDetail = require('account/views/file-detail');

module.exports = Z.Region.extend({
  el: 'div.card-detail-left',

  showDetail: function(card) {
    var detailView;

    switch (card.get('type')) {
      case 'note':
        detailView = NoteDetail;
        break;
      case 'file':
        detailView = FileDetail;
        break;
    }

    if (detailView) this.setView(detailView, {model: card}).show();
    return this;
  }
});
