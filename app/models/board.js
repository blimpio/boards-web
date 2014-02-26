module.exports = Zeppelin.Model.extend({
  name: 'Board',

  validations: {
    name: {
      isEmpty: false,
      message: 'Every board requires at least a name.'
    },

    account: {
      isRequired: true,
      message: 'Every board must be tied to an account.'
    }
  },

  url: function() {
    var url = '/api/boards/';
    return this.isNew() ? url : url + this.id + '/';
  }
});
