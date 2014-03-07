module.exports = Zeppelin.Model.extend({
  name: 'Card',

  validations: {
    name: {
      isEmpty: false,
      message: 'Every card requires at least a name.'
    },

    board: {
      isRequired: true,
      message: 'Every card must be tied to a board.'
    },

    content: {
      isEmpty: false,
      message: 'Every card requires some type of content.'
    }
  },

  url: function() {
    var url = '/api/cards/';
    return this.isNew() ? url : url + this.id + '/';
  }
});
