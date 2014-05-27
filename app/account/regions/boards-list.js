module.exports = Z.Region.extend({
  el: 'div.account-page-sidebar-list',

  keepEl: true,

  view: require('account/views/boards-list'),

  setHeight: function() {
    this.$el.height($(document).height() - 132);
    return this;
  },

  onShow: function() {
    this.setHeight();
  }
});
