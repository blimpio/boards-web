module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('signup/templates/layout'),

  regions: {
    form: require('signup/regions/form'),
    invitation: require('core/regions/invitation')
  },

  elements: {
    page: '#signup'
  },

  render: function(hasInvite) {
    var template = hasInvite
      ? require('signup/templates/invitation-layout')
      : require('signup/templates/layout')

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

  showForm: function(step) {
    if (step) {
      this.getRegion('form').show(step);
    } else {
      this.getRegion('form').show();
    }

    return this;
  },

  showInvitation: function(options) {
    options.isSignup = true;
    this.getRegion('invitation').show(options);
    return this;
  }
});
