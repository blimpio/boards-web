module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      color: '#E5E5E5',
      html_url: '',
      created_by: {
        id: App.User.id,
        username: App.User.get('username')
      },
      modified_by: {
        id: App.User.id,
        username: App.User.get('username')
      },
      is_selected: false,
      activity_html_url: null,
      thumbnail_lg_path: null,
      thumbnail_md_path: null,
      thumbnail_sm_path: null,
      thumbnail_xs_path: null
    };
  },

  localAttributes: ['is_selected', 'author'],

  url: function() {
    var url = App.API_URL + '/boards/';
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

  leave: function() {
    var self = this;

    return $.post(this.url() + 'leave/', function() {
      self.trigger('destroy', self);
    });
  },

  select: function(options) {
    options = options || {
      navigate: true,
      location: 'board'
    };

    this.set('is_selected', true).trigger('selected');
    this.broadcast('board:selected', this);

    if (options.navigate) {
      this.broadcast('router:navigate', this.getUrl(options.location), {
        trigger: false
      });
    }
  },

  deselect: function() {
    this.set('is_selected', false).trigger('deselected');
    this.broadcast('board:deselected', this);
  },

  getUrl: function(type) {
    var url;

    type = type || 'board';

    if (type === 'board') {
      url = this.get('html_url');
    } else if (type === 'activity') {
      url = this.get('activity_html_url');
    }

    return url.replace(window.location.origin, '');
  },

  getShareUrl: function() {
    return window.location.href;
  },

  getAvatar: function() {
    return this.get('thumbnail_xs_path');
  },

  isPublic: function() {
    return this.get('is_shared') === true;
  },

  isMine: function() {
    return this.get('created_by').id === App.User.id;
  }
});
