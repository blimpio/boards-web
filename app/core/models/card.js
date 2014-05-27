module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      html_url: '',
      download_html_url: '',
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
    var url = App.API_URL + '/cards/';
    return this.isNew() ? url : url + this.id + '/';
  },

  getUrl: function(type) {
    var url;

    type = type || 'card';

    if (type === 'card') {
      url = this.get('html_url');
    } else if (type === 'download') {
      url = this.get('download_html_url');
    }

    return url.replace(window.location.origin, '');
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
  },

  download: function() {
    return $.getJSON(this.url() + 'download/');
  }
});
