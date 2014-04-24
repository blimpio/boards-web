module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      featured: false,
      created_by: App.User.id,
      modified_by: App.User.id,
      is_selected: false
    };
  },

  localAttributes: ['is_selected'],

  validations: {
    name: {
      isEmpty: false,
      message: 'Every card requires at least a name.'
    },

    board: {
      isRequired: true,
      message: 'Every card must be tied to a board.'
    },

    content: function(content) {
      if (this.get('type') !== 'stack' && !content) {
        return 'Every card requires some type of content.';
      }
    }
  },

  url: function() {
    var url = '/api/cards/';
    return this.isNew() ? url : url + this.id + '/';
  },

  getUrl: function() {
    var boardSlug = '',
        accountSlug = '';

    this.request('boards:current', function(board) {
      if (board) boardSlug = board.get('slug');
    });

    this.request('accounts:current', function(account) {
      if (account) accountSlug = account.get('slug');
    });

    return '/' + accountSlug + '/' + boardSlug + '/' + this.get('slug') + '/';
  },

  select: function() {
    this.set('is_selected', true).trigger('selected');
    this.broadcast('card:selected', this);
    this.broadcast('router:navigate', this.getUrl(), {
      trigger: false
    });
  },

  isNote: function() {
    return this.get('type') === 'note';
  },

  isFile: function() {
    return this.get('type') === 'file';
  }
});
