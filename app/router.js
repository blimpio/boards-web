module.exports = Zeppelin.Router.extend({
  routes: {
    '': 'index',
    'signin/': 'signin',
    'signup/?token:token': 'signupWithToken',
    'signup/': 'signup',
    'signout/': 'signout',
    'forgot_password/': 'forgotPassword',
    'reset_password/?token:token': 'resetPasswordWithToken',
    'reset_password/': 'resetPassword',
    'accounts/': 'accounts',
    ':account/': 'account',
    ':account/:board/': 'board',
    ':account/:board/:card/': 'card'
  },

  subscriptions: {
    'card:selected': 'onCardSelected',
    'board:selected': 'onBoardSelected',
    'router:navigate': 'navigateWithTrigger'
  },

  validations: {
    'signin/': 'isNotAuthenticated',
    'signup/?token:token': 'isNotAuthenticated',
    'signup/': 'isNotAuthenticated',
    'forgot_password/': 'isNotAuthenticated',
    'accounts/': 'accountsValidation',
    ':account/': 'accountExists',
    ':account/:board/': 'authIsRequired'
  },

  initialize: function() {
    this.on('route:invalid', this.onError, this);
  },

  onError: function(route, error) {
    if (error === 'Auth is required.') {
      this.navigateWithTrigger('/signin/');
    } else if (error === 'User is not in account.') {
      this.navigateWithTrigger('/accounts/');
    } else if (error === 'User has only one account.') {
      this.navigateWithTrigger(App.Accounts.at(0).get('slug') + '/');
    } else if (error === 'User is already authenticated.') {
      this.navigateWithTrigger('/accounts/');
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
      if (!App.User.isSignedIn()) return 'Auth is required.';
    }
  },

  isNotAuthenticated: function(route) {
    if (/(sign(in|up))/.test(route.fragment)) {
      if (App.User.isSignedIn()) return 'User is already authenticated.';
    }
  },

  accountExists: function(route) {
    if(!App.Accounts.userHasAccount(route.params[0])) return 'User is not in account.';
  },

  hasOneAccount: function(route) {
    if (App.Accounts.length === 1) return 'User has only one account.';
  },

  accountsValidation: function(route) {
    var authError = this.authIsRequired(route),
        hasOneAccountError = this.hasOneAccount(route);

    if (authError) return authError;
    if (hasOneAccountError) return hasOneAccountError;
  },

  removeLastController: function() {
    if (this.controller) this.controller.unplug(true);
    return this;
  },

  index: function() {
    this.navigateWithTrigger('/accounts/');
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
  },

  resetPasswordWithToken: function(token) {
    this.controller = _.createController('reset-password');
    this.controller.validateToken(token);
  },

  signout: function() {
    App.User.signout();
    this.navigateWithTrigger('/signin/');
  },

  accounts: function() {
    this.controller = _.createController('accounts');
  },

  account: function(account) {
    App.Accounts.setCurrent(account);
    this.controller = _.createController('account');
  },

  onBoardSelected: function(board) {
    var url;

    if (!board) {
      this.navigateWithTrigger(App.Accounts.getSlug() + '/');
    } else {
      url = App.Accounts.getSlug() + '/' + board.get('slug') + '/';

      if (this.controller && this.controller.name === 'BoardController') {
        this.navigate(url);
        this.controller.changeCurrentBoard(board);
      } else {
        this.navigateWithTrigger(url);
      }
    }
  },

  board: function(account, board) {
    App.Accounts.setCurrent(account);
    this.controller = _.createController('board', {boardSlug: board});
  },

  onCardSelected: function(card) {
    var url;

    if (!card) {
      this.navigateWithTrigger(App.Accounts.getSlug() + '/' + App.Boards.getSlug() + '/');
    } else {
      url = App.Accounts.getSlug() + '/' + App.Boards.getSlug() + '/' + card.get('slug') + '/';
      this.navigateWithTrigger(url);
    }
  },

  card: function(account, board, card) {
    App.Accounts.setCurrent(account);
    this.controller = _.createController('card', {
      cardSlug: card,
      boardSlug: board
    });
  }
});
