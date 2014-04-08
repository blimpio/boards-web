var Person = require('core/models/person');

module.exports = Person.extend({
  url: function() {
    var url = '/api/boards/collaborators/';
    return this.isNew() ? url : url + this.id + '/';
  },

  hasAccount: function() {
    return this.get('user') !== null;
  },

  isOwner: function(board) {
    if (!this.hasAccount()) return false;

    if (!board) {
      this.request('boards:current', function(currentBoard) {
        board = currentBoard;
      });
    }

    if (board.get('created_by') === this.get('user').id) return true;

    return false;
  },

  getName: function() {
    if (this.hasAccount()) {
      return this.get('user').first_name + ' ' + this.get('user').last_name;
    } else {
      return this.get('invited_user').email;
    }
  },

  getAvatar: function() {
    if (this.hasAccount()) {
      return this.get('user').gravatar_url;
    } else {
      return '';
    }
  },

  getUsername: function() {
    if (this.hasAccount()) {
      return this.get('user').username;
    } else {
      return '';
    }
  },

  canEdit: function() {
    return this.get('permission') === 'write';
  }
});
