module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: function() {
    var className = 'collaborator clearfix ';

    className += 'can-' + this.model.get('permissions');
    if (this.model.isOwner()) className += ' is-owner';
    return className;
  },

  template: require('account/templates/edit-collaborator'),

  events: {
    'click button[data-permission]': 'onChangePermission',
    'click [data-action=removeCollaborator]': 'removeCollaborator'
  },

  elements: {
    permission: 'div.collaborator-permissions',
    permissionText: 'span.collaborator-permissions-toggle-text'
  },

  context: function() {
    return {
      name: this.model.getName(),
      avatar: this.model.getAvatar(),
      isOwner: this.model.isOwner(),
      username: this.model.getUsername(),
      permission: this.model.get('permission')
    }
  },

  removeCollaborator: function() {
    if (window.confirm('Are you sure you want to remove this invitation?')) {
      this.model.destroy();
    }

    return this;
  },

  setPermission: function(permission) {
    this.getElement('permission').attr('data-permission', permission);

    this.getElement('permissionText')
      .text('Can ' + (permission === 'write' ? 'edit' : 'view'));

    this.model.save('permission', permission);
    return this;
  },

  onChangePermission: function(event) {
    this.setPermission($(event.currentTarget).data('permission'));
  }
});

