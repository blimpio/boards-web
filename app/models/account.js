module.exports = Zeppelin.Model.extend({
  name: 'Account',

  presenters: ['serialize'],

  serialize: function() {
    return {
      url: '/' + this.get('slug') + '/',
      name: this.get('name'),
      image: this.getImageUrl()
    };
  },

  getImageUrl: function() {
    return this.get('image_url') || _.asset('images/no-image.png');
  }
});
