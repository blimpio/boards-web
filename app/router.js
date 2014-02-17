module.exports = Zeppelin.Router.extend({
  routes: {
    '': 'index',
    'signin(/)': 'signin',
    'signup(/)': 'signup',
    'signup?token:token(/)': 'signupWithToken',
    'signout(/)': 'signout',
    'forgot_password(/)': 'forgotPassword',
    'reset_password(/)': 'resetPassword',
    'reset_password?token:token(/)': 'resetPasswordWithToken',
    'accounts(/)': 'accounts',
    ':account(/)': 'boards'
  },

  subscriptions: {
    'router:navigate': 'navigateWithTrigger'
  },

  validations: {
    'signin(/)': 'isNotAuthenticated',
    'signup(/)': 'isNotAuthenticated',
    'signup?token:token(/)': 'isNotAuthenticated',
    'forgot_password(/)': 'isNotAuthenticated',
    'accounts(/)': 'authIsRequired',
    ':account(/)': 'accountExists'
  },

  initialize: function() {
    this.on('route:invalid', this.onError, this);
  },

  onError: function(route, error) {
    if (error === 'Auth is required.') {
      this.navigateWithTrigger('signin');
    } else if (error === 'User is not in account.') {
      this.navigateWithTrigger('accounts');
    } else if (error === 'User is already authenticated.') {
      this.navigateWithTrigger('accounts');
    }
  },

  beforeRoute: function() {
    this.removeLastController();
  },

  navigateWithTrigger: function(fragment) {
    this.navigate(fragment, {trigger: true});
  },

  authIsRequired: function(route) {
    if (!/(sign(in|up))/.test(route.fragment)) {
      if (!_.getModel('User').isSignedIn()) return 'Auth is required.';
    }
  },

  isNotAuthenticated: function(route) {
    if (/(sign(in|up))/.test(route.fragment)) {
      if (_.getModel('User').isSignedIn()) return 'User is already authenticated.';
    }
  },

  accountExists: function(route) {
    var autoError = this.authIsRequired(route);
    if (autoError) return autoError;
    if(!_.getModel('User').isInAccount(route.params[0])) return 'User is not in account.';
  },

  removeLastController: function() {
    if (this.controller) {
      this.controller.remove();
    }

    return this;
  },

  index: function() {
    this.navigateWithTrigger('accounts');
  },

  signup: function() {
    this.controller = _.createController('signup');
  },

  signupWithToken: function(token) {
    this.controller = _.createController('signup');
    this.controller.continueWithToken(token);
  },

  signin: function() {
    this.controller = _.createController('signin');
  },

  forgotPassword: function() {
    this.controller = _.createController('forgot-password');
  },

  resetPassword: function() {
    this.controller = _.createController('reset-password');
    this.controller.renderForm();
  },

  resetPasswordWithToken: function(token) {
    this.controller = _.createController('reset-password');
    this.controller.validateToken(token);
  },

  signout: function() {
    _.getModel('User').signout();
    this.navigateWithTrigger('signin');
  },

  accounts: function() {
    this.controller = _.createController('accounts');
  },

  boards: function() {
    this.removeLastController();
    this.controller = _.createController('boards');
  }
});
