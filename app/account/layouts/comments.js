var CreateComment = require('account/views/create-comment');

module.exports = Z.Layout.extend({
  el: 'div.comments-layout',

  keepEl: true,

  template: require('account/templates/comments-layout'),

  regions: {
    createComment: require('account/regions/create-comment'),
    publicComments: require('account/regions/public-comments'),
    collaboratorComments: require('account/regions/collaborator-comments')
  },

  events: {
    'click a[data-comments]': 'onCommentsToggleClick',
    'click [data-action=openAccountSettings]': 'openAccountSettings'
  },

  elements: {
    currentCommentsType: 'span.current-comments-type'
  },

  context: function() {
    return {
      isPublicBoard: this.options.isPublicBoard
    };
  },

  renderCommentForm: function() {
    this.getRegion('createComment').setView(CreateComment, {
      cardId: this.options.card.id,
      creator: this.options.creator
    }).show();
  },

  onCommentsToggleClick: function(event) {
    event.preventDefault();

    if ($(event.currentTarget).data('comments') === 'public') {
      this.getElement('currentCommentsType').text('Commesnts from public');
      this.showPublicComments();
    } else {
      this.getElement('currentCommentsType').text('Commesnts from collaborators');
      this.showCollaboratorComments();
    }
  },

  renderCollaboratorComments: function() {
    this.getRegion('collaboratorComments').toggleLoadingState().show();
    return this;
  },

  showCollaboratorComments: function() {
    this.getRegion('publicComments').$el.hide();
    this.getRegion('createComment').$el.show();
    this.getRegion('collaboratorComments').$el.show();

    if (!this.getRegion('collaboratorComments').isShown()) {
      this.renderCollaboratorComments();
    }
  },

  renderPublicComments: function() {
    this.showRegion('publicComments');
    return this;
  },

  showPublicComments: function() {
    this.getRegion('createComment').$el.hide();
    this.getRegion('collaboratorComments').$el.hide();
    this.getRegion('publicComments').$el.show();

    if (!this.getRegion('publicComments').isShown()) {
      this.renderPublicComments();
    }
  },

  openAccountSettings: function() {
    this.broadcast('settings:accounts:open');
    return this;
  }
});
