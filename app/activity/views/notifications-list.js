module.exports = Zeppelin.CollectionView.extend({
  listSelector: 'ol.notifications-list',

  template: require('activity/templates/notifications-list'),

  itemView: require('activity/views/notification'),

  addMethod: 'prepend',

  elements: {
    showMoreBtn: '[data-action=showMoreNotifications]'
  },

  events: {
    'click [data-action=showMoreNotifications]': 'onMoreNotificationsClick'
  },

  collection: function() {
    return App.Notifications;
  },

  context: function() {
    return {
      hasPagination: this.collection.hasPagination()
    }
  },

  toggleMoreButton: function() {
    this.getElement('showMoreBtn').toggle(this.collection.hasPagination());
    return this;
  },

  onRenderItems: function() {
    this.toggleMoreButton();
  },

  onAppendItem: function() {
    this.toggleMoreButton();
  },

  onMoreNotificationsClick: function() {
    var self = this;

    this.addMethod = 'append';
    this.getElement('showMoreBtn').text('Loading...');

    this.collection.fetchNext().done(function() {
      self.toggleMoreButton();
      self.getElement('showMoreBtn').text('Show More');
    });
  }
});

