module.exports = Zeppelin.View.extend({
  name: 'BoardActions',

  className: 'board-actions',

  template: require('templates/board-actions'),

  events: {
    'click [data-action=addNote]': 'onClickAddNote',
    'click [data-action=addFile]': 'onClickAddFile'
  },

  onClickAddNote: function() {
    this.publish('card:creating', 'note');
    return this;
  },

  onClickAddFile: function() {
    this.publish('card:creating', 'file');
    return this;
  }
});
