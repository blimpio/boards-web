module.exports = Zeppelin.Model.extend({
  name: 'Account',

  presenters: ['serialize'],

  serialize: function() {
    return {
      url: '/' + this.get('slug') + '/',
      name: this.get('name'),
      image: this.get('image_url') ? this.get('image_url') : '/default/'
    };
  }
});
