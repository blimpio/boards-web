module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('forgot-password/templates/layout'),

  regions: {
    form: require('forgot-password/regions/form')
  }
});
