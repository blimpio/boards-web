module.exports = Z.Layout.extend({
  el: 'div.account-page-content',

  keepEl: true,

  regions: {
    header: require('account/regions/content-header'),
    notifications: require('activity/regions/notifications-list')
  },

  toggleLoadingContentState: function() {
    this.$el.removeClass('is-empty');
    this.$el.toggleClass('is-loading');
    return this;
  },

  toggleEmptyNotificationsState: function(hasNoNotifications) {
    this.$el.removeClass('is-loading');
    this.$el.toggleClass('is-empty', hasNoNotifications);
    return this;
  },

  showNotifications: function(options) {
    this.getRegion('header').showBoard(false, {
      model: options.board
    });

    this.getRegion('notifications').$el.show();

    if (!this.getRegion('notifications').isShown()) {
      this.getRegion('notifications').show();
    }

    return this;
  }
});
