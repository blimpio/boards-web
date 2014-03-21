module.exports = Zeppelin.View.extend({
  name: 'CardStack',

  tagName: 'li',

  className: 'card is-item',

  attributes: function() {
    return {
      'data-type': this.model.get('type')
    };
  },

  events: {
    'click': 'onClick',
    'click [data-action=delete]': 'onClickDelete',
    'click [data-action=unstack]': 'onClickUnstack'
  },

  model: require('models/card'),

  template: require('templates/stack'),

  isDetail: false,

  context: function() {
    return _.extend({}, this.model.getPresenters(), {
      cards: this.model.getCards(),
      count: this.model.get('cards').length,
      isDetail: this.isDetail
    });
  },

  onRender: function() {
    this.$el.data('id', this.model.id);

    this.$el.droppable({
      drop: _.bind(this.onDrop, this)
    });

    return this;
  },

  onClick: function() {
    if (!this.model.isNew()) this.publish('card:selected', this.model);
    return this;
  },

  onDrop: function(event, ui) {
    this.model.addCard(ui.helper.data('id')).save();
    ui.helper.remove();
    this.render();
    this.publish('cards:layout');
    return this;
  },

  onClickDelete: function(event) {
    event.stopPropagation();

    if (window.confirm('Deleteing a stack will delete all of it\'s cards.')) {
      this.model.destroy();
      this.publish('cards:layout');
    }

    return this;
  },

  onClickUnstack: function(event) {
    event.stopPropagation();
    this.$el.hide();

    _.forEach(this.model.get('cards'), function(id) {
      this.publish('card:append', id);
    }, this);

    this.model.unstack();
    this.remove();
    this.publish('cards:layout');
    return this;
  }
});
