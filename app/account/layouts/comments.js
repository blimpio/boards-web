var CreateComment = require('account/views/create-comment');

module.exports = Z.Layout.extend({
  el: '#card-detail-comments',

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

  toggleLoadingState: function() {
    this.getRegion('collaboratorComments').toggleLoadingState();
    return this;
  },

  showComments: function(options) {
    this.getRegion('createComment').showForm({
      card: options.card,
      user: options.user
    });

    this.showCollaboratorComments();
    return this;
  },

  showCommentForm: function() {
    this.getRegion('createComment').setView(CreateComment, {
      cardId: this.options.card.id,
      creator: this.options.currentUser
    }).show();

    return this;
  },

  renderCollaboratorComments: function() {
    this.getRegion('collaboratorComments').show();
    return this;
  },

  showCollaboratorComments: function() {
    this.getRegion('publicComments').$el.hide();
    this.getRegion('createComment').$el.show();
    this.getRegion('collaboratorComments').$el.show();

    if (!this.getRegion('collaboratorComments').isShown()) {
      this.renderCollaboratorComments();
    }

    this.toggleLoadingState();
    return this;
  },

  renderPublicComments: function() {
    this.getRegion('publicComments').view.options = {
      canEdit: this.options.canEdit
    };

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
  },

  onCommentsToggleClick: function(event) {
    event.preventDefault();

    if ($(event.currentTarget).data('comments') === 'public') {
      this.getElement('currentCommentsType').text('Comments from public');
      this.showPublicComments();
    } else {
      this.getElement('currentCommentsType').text('Comments from collaborators');
      this.showCollaboratorComments();
    }
  }
});
