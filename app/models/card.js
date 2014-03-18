module.exports = Zeppelin.Model.extend({
  name: 'Card',

  defaults: {
    upload_progress: 0,
  },

  validations: {
    name: {
      isEmpty: false,
      message: 'Every card requires at least a name.'
    },

    board: {
      isRequired: true,
      message: 'Every card must be tied to a board.'
    },

    content: {
      isEmpty: false,
      message: 'Every card requires some type of content.'
    }
  },

  localAttributes: ['upload_progress'],

  presenters: ['name', 'content', 'smallThumbnail', 'largeThumbnail', 'date_created'],

  url: function() {
    var url = '/api/cards/';
    return this.isNew() ? url : url + this.id + '/';
  },

  smallThumbnail: function() {
    return this.get('thumbnail_sm_path') ||
    this.get('content') || _.asset('images/generic-file.png');
  },

  largeThumbnail: function() {
    return this.get('thumbnail_lg_path') ||
    this.get('content') || _.asset('images/generic-file.png');
  },

  isNote: function() {
    return this.get('type') === 'note';
  },

  isFile: function() {
    return this.get('type') === 'file';
  }
});
