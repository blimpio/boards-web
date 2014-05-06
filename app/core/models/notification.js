module.exports = Z.Model.extend({
  getType: function() {
    if (this.get('verb') === 'created a card on board') {
      return 'card:created';
    } else if (this.get('verb') === 'highlighted') {
      return 'card:highlighted';
    } else if (this.get('verb') === 'created a stack') {
      return 'stack:created';
    } else if (this.get('verb') === 'commented') {
      return 'comment:created';
    } else if (this.get('verb') === 'is now a collaborator on board') {
      return 'collaborator:created';
    }
  },

  getData: function() {
    var notification = {
      time: this.get('timesince'),
      card: this.get('action_object'),
      board: this.get('target'),
      actor: this.get('actor')
    };

    notification.card.avatar = notification.card.thumbnail_sm_path;
    return notification;
  }
});
