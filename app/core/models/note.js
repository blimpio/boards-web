var Card = require('core/models/card');

module.exports = Card.extend({
  defaults: function() {
    return _.extend({
      type: 'note'
    }, Card.prototype.defaults());
  },

  updateTask: function(index, checked) {
    var self = this,
        note = this.get('content'),
        tasks = note.match(/(\s*\[[x ]\]\s*).+/gm),
        changingTask = tasks[index],
        tasksCounter = 0,
        originalTask = changingTask;

    if (checked) {
      changingTask = changingTask.replace('[ ]', '[x]');
    } else {
      changingTask = changingTask.replace('[x]', '[ ]');
    }

    this.save({
      content: note.replace(/(\s*\[[x ]\]\s*).+/gm, function(match) {
        if (tasksCounter === index) {
          tasksCounter += 1;
          return changingTask;
        } else {
          tasksCounter += 1;
          return match;
        }
      })
    });
  }
});
