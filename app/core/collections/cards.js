module.exports = Zeppelin.Collection.extend({
  url: App.API_URL + '/cards/',

  model: function(attrs, options) {
    var Model;

    switch(attrs.type) {
      case 'file':
        Model = require('core/models/file');
        break;
      default:
        Model = require('core/models/card');
    }

    return new Model(attrs, options);
  },

  subscriptions: {
    'card:created': 'onCardCreated'
  },

  comparator: function(model) {
    return -model.get('position');
  },

  initialize: function() {
    this.on('change:is_selected', this.onCardSelected, this);
  },

  setCurrent: function(slug) {
    this.current = _.first(this.where({slug: slug}));
    return this;
  },

  onCardCreated: function(card) {
    if (Z.Util.isModel(card)) this.add(card);
  },

  onCardSelected: function(card, value) {
    var previouslySelected = this.find(function(_card) {
      return _card.get('is_selected') && _card.cid !== card.cid;
    });

    if (previouslySelected) {
      previouslySelected.set('is_selected', false, {
        silent: true
      }).trigger('deselected');
    }

    this.current = card;
    this.trigger('change:current', this.current);
  },

});
