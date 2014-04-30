module.exports = Z.Region.extend({
  el: 'div.card-detail-info-container',

  showDetailInfo: function(options) {
    var DetailsInfoView = options.canEdit
      ? require('account/views/card-detail-info')
      : require('public-board/views/card-detail-info');

    this.setView(DetailsInfoView, {model: options.card}).show();
    return this;
  }
});
