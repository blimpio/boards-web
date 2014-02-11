var SignupController = require('controllers/signup'),
    SigninController = require('controllers/signin'),
    ForgotPasswordController = require('controllers/forgot-password'),
    ResetPasswordController = require('controllers/reset-password'),
    BoardsController = require('controllers/boards');

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
    this.controller = new SignupController();
  },

  signupWithToken: function(token) {
    this.removeLastController();
    this.controller = new SignupController();
    this.controller.continueWithToken(token);
  },

  signin: function() {
    this.removeLastController();
    this.controller = new SigninController();
  },

  forgotPassword: function() {
    this.removeLastController();
    this.controller = new ForgotPasswordController();
  },

  resetPassword: function() {
    this.removeLastController();
    this.controller = new ResetPasswordController();
    this.controller.renderForm();
  },

  resetPasswordWithToken: function(token) {
    this.removeLastController();
    this.controller = new ResetPasswordController();
    this.controller.validateToken(token);
  },

  signout: function() {
    Boards.getUser().signout();
    this.navigateWithTrigger('signin');
  },

  boards: function() {
    this.removeLastController();
    this.controller = new BoardsController();
  }
});
