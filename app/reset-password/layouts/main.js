module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('reset-password/templates/layout'),

  regions: {
    form: require('reset-password/regions/form')
  }
});
