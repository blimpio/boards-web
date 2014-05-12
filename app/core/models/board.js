module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      html_url: '',
      created_by: App.User.id,
      modified_by: App.User.id,
      is_selected: false,
      activity_html_url: ''
    };
  },

  localAttributes: ['is_selected'],

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
    return this.get('thumbnail_sm_path');
  },

  isPublic: function() {
    return this.get('is_shared') === true;
  }
});
