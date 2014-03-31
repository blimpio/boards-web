module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('home/templates/layout'),

  regions: {
    signupRequest: require('home/regions/signup-request')
  }
});
