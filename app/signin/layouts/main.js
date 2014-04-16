module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('signin/templates/layout'),

  regions: {
    form: require('signin/regions/form'),
    invitation: require('core/regions/invitation')
  },

  elements: {
    page: '#signin'
  },

  render: function(hasInvite) {
    var template = hasInvite
      ? require('signin/templates/invitation-layout')
      : require('signin/templates/layout')

    Z.Layout.prototype.render.call(this, template);
    return this;
  },

  toggleLoadingMainState: function() {
    this.getElement('page').toggleClass('is-loading');
    return this;
  },

  toggleSignupFullWidth: function() {
    this.getRegion('form').$el.toggleClass('col-md-7');
    this.getRegion('invitation').$el.toggleClass('col-md-5');
    this.getElement('page').toggleClass('row');

    if (!this.getElement('page').hasClass('row')) {
      this.getRegion('form').view.focus();
    }

    return this;
  },

  toggleInviteFullWidth: function() {
    this.getRegion('form').$el.hide();
    this.getRegion('invitation').$el.toggleClass('col-md-5');
    this.getElement('page').toggleClass('row user-is-auth');
    return this;
  },

  showForm: function() {
    this.getRegion('form').show();
    return this;
  },

  showInvitation: function(options) {
    options.isSignin = true;
    this.getRegion('invitation').show(options);
    return this;
  }
});
