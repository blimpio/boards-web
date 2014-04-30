module.exports = Z.Region.extend({
  el: 'div.account-page-sidebar-list',

  view: require('account/views/boards-list'),

  events: {
    'mouseout': 'onMouseOut',
    'mouseover': 'onMouseOver'
  },

  setHeight: function() {
    this.$el.height($(document).height() - 132);
    return this;
  },

  onShow: function() {
    this.setHeight();
  },

  onMouseOut: function() {
    $('body').removeClass('ui-no-scroll');
  },

  onMouseOver: function() {
    $('body').addClass('ui-no-scroll');
  }
});
