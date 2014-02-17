module.exports = Zeppelin.Model.extend({
  name: 'User',

  defaults: {
    signup_step: 1
  },

  localAttributes: ['signup_step', 'passwordReset'],

  requestSignup: function() {
    return Boards.Connection.post('/api/auth/signup_request/', {
      email: this.get('email')
    });
  },

  setEmailFromJWT: function(token) {
    var tokenData;

    token = token || '';
    token = token.replace(/^=/, '');
    tokenData = _.decodeJWT(token);

    if (tokenData.email) {
      this.set({
        'email': tokenData.email,
        'signup_request_token': token
      });
    }

    return this;
  },

  isWaitingForEmailValidation: function() {
    return this.has('email') && this.get('signup_step') === 2;
  },

  updateSignupStep: function(step) {
    this.set('signup_step', step).saveCache();
    return this;
  },

  validateSignupEmailDomain: function(domains) {
    return Boards.Connection.post('/api/auth/signup_domains/validate/', {
      signup_domains: domains
    });
  },

  hasInviteDomains: function() {
    return this.has('signup_domains') && this.get('signup_domains').length > 0;
  },

  validateUsername: function() {
    return Boards.Connection.post('/api/auth/username/validate/', {
      username: this.get('username')
    });
  },

  signup: function(user) {
    user = user || this.toJSON();
    return Boards.Connection.post('/api/auth/signup/', user);
  },

  signin: function(user) {
    user = user || this.toJSON();
    return Boards.Connection.post('/api/auth/signin/', user);
  },

  signout: function() {
    this.clear();
    this.cache.clearAll();
    return this;
  },

  isSignedIn: function() {
    return this.has('token');
  },

  forgotPassword: function(email) {
    email = email || this.get('email');
    return Boards.Connection.post('/api/auth/forgot_password/', {email: email});
  },

  setPasswordResetDataFromJWT: function(token) {
    var tokenData;

    token = token || '';
    token = token.replace(/^=/, '');
    tokenData = _.decodeJWT(token);

    if (tokenData.type === 'PasswordReset') {
      this.set({
        passwordResetData: {
          id: tokenData.id,
          type: tokenData.type,
          token: token,
          version: tokenData.token_version
        }
      }).saveCache();
    }

    return this;
  },

  canResetPassword: function() {
    var reset = this.get('passwordResetData');
    return reset && reset.token && reset.type === 'PasswordReset';
  },

  resetPassword: function(password) {
    if (this.canResetPassword() && password) {
      return Boards.Connection.post('/api/auth/reset_password/', {
        token: this.get('passwordResetData').token,
        password: password
      });
    }
  },

  fetchAccounts: function() {
    Boards.Connection.get('/api/accounts/', this.get('token')).done(function(accounts) {
      this.set('accounts', accounts);
      this.publish('user:accounts:fetched', accounts);
    }.bind(this)).fail(function(error) {
      this.publish('user:accounts:fetched', error);
    }.bind(this));
  },

  accounts: function() {
    var accounts = [];

    _.forEach(this.get('accounts'), function(account) {
      accounts.push({
        url: '/' + account.slug + '/',
        name: account.name,
        image: account.image_url ? account.image_url : '/default/'
      });
    });

    return accounts;
  },

  isInAccount: function(slug) {
    if (slug) {
      return _.find(this.get('accounts'), {slug: slug}) !== undefined;
    } else {
      return false;
    }
  }
});
