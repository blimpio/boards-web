module.exports = Z.Region.extend({
  el: 'div.collaborator-comments',

  view: require('account/views/comments-list'),

  toggleLoadingState: function() {
    this.$el.toggleClass('is-loading');
    return this;
  }
});
