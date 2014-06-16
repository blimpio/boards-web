var Card = require('core/models/card');

module.exports = Card.extend({
  defaults: function() {
    return _.extend({
      type: 'note'
    }, Card.prototype.defaults());
  },

  updateTask: function(task) {
    var self = this,
        content = this.get('content'),
        originalTask = task;

    if (/^\s*\[ \]\s*/.test(task)) {
      task = task.replace('[ ]', '[x]');
    } else {
      task = task.replace('[x]', '[ ]');
    }

    this.save('content',  content.replace(originalTask, task));
  }
});
