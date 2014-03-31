module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('signup/templates/layout'),

  regions: {
    form: require('signup/regions/form')
  }
});
