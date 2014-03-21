module.exports = Zeppelin.FormView.extend({
  name: 'StackDetail',

  form: 'form.stack-edit-form',

  className: 'card is-detail',

  attributes: {
    'data-type': 'stack'
  },

  template: require('templates/stack'),

  events: {
    'click strong.stack-name': 'showEditMode',
    'click [data-action=cancel]': 'hideEditMode'
  },

  elements: {
    info: 'div.stack-info',
    cards: 'ul.stack-cards',
    nameInput: 'input[name=name]'
  },

  initialize: function() {
    this.initActions();
  },

  onRender: function() {
    var stack = this.model.id;

    if (!this.hasView('stackCards')) {
      this.registerView(require('views/stack-cards'), {
        el: this.$cards,
        list: this.$cards,
        autoRenders: false
      }, 'stackCards');

      this.getView('stackCards')
        .render(function(card) {
          return card.get('stack') === stack;
        });

      setTimeout(_.bind(function() {
        this.getView('stackCards').arrange();
      }, this), 50);
    }
  },

  initActions: function() {
    this.registerView(require('views/stack-actions'), 'stackActions');
    this.getView('stackActions').insert('div.sub-header-actions');
    this.listenTo(this.getView('stackActions'), 'stack:unstack', this.onClickUnstack);
    this.listenTo(this.getView('stackActions'), 'stack:delete', this.onClickDelete);
  },

  context: function() {
    return _.extend({}, this.model.getPresenters(), {
      isDetail: true
    });
  },

  showEditMode: function(type) {
    this.$info.addClass('is-editing');
    return this;
  },

  hideEditMode: function() {
    this.reset().$info.removeClass('is-editing');
    return this;
  },

  reset: function() {
    this.$nameInput.val(this.model.get('name'));
    Zeppelin.FormView.prototype.reset.apply(this, arguments);
    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();
    this.setAttributes();

    if (!this.model.validationError) {
      this.model.save();
      this.hideEditMode().render();
    }

    return this;
  },

  onClickDelete: function(event) {
    if (window.confirm('Deleteing a stack will delete all of it\'s cards.')) {
      this.model.destroy();
      this.publish('board:selected', App.Boards.getCurrent());
    }

    return this;
  },

  onClickUnstack: function(event) {
    this.model.unstack();
    this.publish('board:selected', App.Boards.getCurrent());
    return this;
  }
});
