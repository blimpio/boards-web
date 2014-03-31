module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('signin/templates/layout'),

  regions: {
    form: require('signin/regions/form')
  }
});
