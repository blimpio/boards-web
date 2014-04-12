module.exports = Z.Region.extend({
  el: '#collaborator-comments',

  view: require('account/views/comments-list'),

  toggleLoadingState: function() {
    this.$el.toggleClass('is-loading');
    return this;
  }
});
