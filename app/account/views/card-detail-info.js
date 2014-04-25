module.exports = Zeppelin.FormView.extend({
  formSelector: 'form.card-detail-edit',

  className: function() {
    var className = 'card-detail-info';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  template: require('account/templates/card-detail-info'),

  events: {
    'click [data-action=edit]': 'toggleEditMode',
    'click [data-action=cancel]': 'toggleEditMode'
  },

  elements: {
    name: 'h1.card-detail-info-name',
    nameInput: 'input[name=name]'
  },

  bindings: {
    model: {
      'change:name': 'onNameChange'
    }
  },

  context: function() {
    var author,
        authorId = this.model.get('created_by');

    this.request('boardCollaborators:collaborator', authorId, function(collaborator) {
      author = collaborator;
    });

    return _.extend({}, this.model.attributes, {
      time: $.timeago(this.model.get('date_created')),
      author: author
    });
  },

  toggleEditMode: function() {
    this.$el.toggleClass('is-editing')
    this.focus();
    return this;
  },

  updateName: function(name) {
    var $input = this.getElement('nameInput');

    if ($input.is(':focus')) {
      $input.on('blur.nameUpdated', function() {
        $input.off('blur.nameUpdated');
        if (name !== $input.val() &&
        this.model.previous('name') === inputVal)  $input.val(name);
      });
    } else {
      $input.val(name);
    }

    this.getElement('name').text(name);
    return this;
  },

  onValidationSuccess: function() {
    this.toggleEditMode();
  },

  onNameChange: function(model, value) {
    this.updateName(value);
  }
});

