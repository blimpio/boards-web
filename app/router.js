module.exports = Zeppelin.Router.extend({
  routes: {
    'signup(/)': 'signup',
    'signin(/)': 'signin',
    'signout(/)': 'signout',
    'signup?token:token(/)': 'signupWithToken',
    'forgot_password(/)': 'forgotPassword',
    'reset_password(/)': 'resetPassword',
    'reset_password?token:token(/)': 'resetPasswordWithToken',
    'boards(/)': 'boards'
  },

  subscriptions: {
    'router:navigate': 'navigateWithTrigger'
  },

  navigateWithTrigger: function(fragment) {
    this.navigate(fragment, {trigger: true});
  },

  removeLastController: function() {
    if (this.controller) {
      this.controller.remove();
    }

    return this;
  },

  signup: function() {
    this.removeLastController();
    this.controller = _.createController('signup');
  },

  signupWithToken: function(token) {
    this.removeLastController();
    this.controller = _.createController('signup');
    this.controller.continueWithToken(token);
  },

  signin: function() {
    this.removeLastController();
    this.controller = _.createController('signin');
  },

  forgotPassword: function() {
    this.removeLastController();
    this.controller = _.createController('forgot-password');
  },

  resetPassword: function() {
    this.removeLastController();
    this.controller = _.createController('reset-password');
    this.controller.renderForm();
  },

  resetPasswordWithToken: function(token) {
    this.removeLastController();
    this.controller = _.createController('reset-password');
    this.controller.validateToken(token);
  },

  signout: function() {
    Boards.getUser().signout();
    this.navigateWithTrigger('signin');
  },

  boards: function() {
    this.removeLastController();
    this.controller = _.createController('boards');
  }
});
