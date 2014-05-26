module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: 'notification',

  template: function(context) {
    var type = this.model.getType().replace(':', '-'),
        template = require('activity/templates/' + type + '-notification');

    return template(context);
  },

  elements: {
    card: 'span.notification-preview-card'
  },

  context: function() {
    return this.model.getData();
  },

  onRender: function() {
    if (this.model.getType() === 'card:created') {
      this.renderCardPreview(this.model.getData().card);
    }
  },

  renderCardPreview: function(card) {
    var NotificationCardView,
        CardView = require('public-board/views/' + card.type),
        CardModel = require('core/models/' + card.type);

    NotificationCardView = CardView.extend({
      tagName: 'div',

      onClick: function() {
        this.broadcast('router:navigate', this.model.getUrl());
      }
    })

    this.card = new NotificationCardView({
      model: new CardModel(card)
    });

    this.getElement('card').html(this.card.render().el);
  },

  onUnplug: function() {
    if (this.card) {
      this.card.unplug();
    }
  }
});

