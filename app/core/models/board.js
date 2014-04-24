module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      created_by: App.User.id,
      modified_by: App.User.id,
      is_selected: false
    };
  },

  localAttributes: ['is_selected'],

  url: function() {
    var url = '/api/boards/';
    return this.isNew() ? url : url + this.id + '/';
  },

  validations: {
    name: {
      isEmpty: false,
      message: 'Every board requires at least a name.'
    },

    account: {
      isRequired: true,
      message: 'Every board must be tied to an account.'
    }
  },

  select: function(options) {
    options = options || {
      navigate: true
    };

    this.set('is_selected', true).trigger('selected');
    this.broadcast('board:selected', this);

    if (options.navigate) {
      this.broadcast('router:navigate', this.getUrl(), {
        trigger: false
      });
    }
  },

  deselect: function() {
    this.set('is_selected', false).trigger('deselected');
    this.broadcast('board:deselected', this);
  },

  getUrl: function() {
    var accountSlug = '';

    this.request('accounts:current', function(account) {
      if (account) accountSlug = account.get('slug');
    });

    return '/' + accountSlug + '/' + this.get('slug') + '/';
  },

  getShareUrl: function() {
    return window.location.href;
  },

  getAvatar: function() {
    return this.get('thumbnail_sm_path') ||
    'https://gravatar.com/avatar/' + md5(this.get('name')) + '?d=retro&s=225';
  },

  isPublic: function() {
    return this.get('is_shared') === true;
  }
});
