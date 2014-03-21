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

    content: function(content) {
      if (this.get('type') !== 'stack' && !content) {
        return 'Every card requires some type of content.';
      }
    }
  },

  localAttributes: ['upload_progress'],

  presenters: ['type', 'name', 'content', 'smallThumbnail', 'largeThumbnail', 'date_created'],

  url: function() {
    var url = '/api/cards/';
    return this.isNew() ? url : url + this.id + '/';
  },

  smallThumbnail: function() {
    return this.get('thumbnail_sm_path') || _.asset('images/generic-file.png');
  },

  largeThumbnail: function() {
    return this.get('thumbnail_lg_path') || _.asset('images/generic-file.png');
  },

  isNote: function() {
    return this.get('type') === 'note';
  },

  isFile: function() {
    return this.get('type') === 'file';
  },

  getCards: function() {
    return _.map(this.get('cards'), function(id) {
      return this.collection.get(id).getPresenters();
    }, this);
  },

  addCard: function(id) {
    var cards = this.get('cards');
    cards.push(id);
    this.set('cards', cards);
    this.collection.get(id).set('stack', this.id);
    this.trigger('change change:cards', this, this.get('cards'));
    return this;
  },

  unstack: function() {
    _.forEach(this.get('cards'), function(card) {
      this.collection.get(card).unset('stack');
    }, this);

    this.trigger('destroy', this, this.collection, {});

    return $.ajax({
      url: '/api/cards/' + this.id + '/unstack/',
      type: 'PUT'
    });
  }
});
