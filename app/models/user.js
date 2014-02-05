module.exports = Zeppelin.Model.extend({
  name: 'User',

  cache: true,

  defaults: {
    signup_step: 1
  },

  localAttributes: ['signup_step', 'passwordReset'],

  requestSignup: function() {
    return Application.connection.post('/api/auth/signup_request/', {
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
    this.set('signup_step', step).updateCache();
    return this;
  },

  validateSignupEmailDomain: function(domains) {
    return Application.connection.post('/api/auth/signup_domains/validate/', {
      signup_domains: domains
    });
  },

  hasInviteDomains: function() {
    var domains = this.get('signup_domains');
    return domains != null && domains.length > 0;
  },

  validateUsername: function() {
    return Application.connection.post('/api/auth/username/validate/', {
      username: this.get('username')
    });
  },

  signup: function(user) {
    user = user || this.toJSON();
    return Application.connection.post('/api/auth/signup/', user);
  },

  signin: function(user) {
    user = user || this.toJSON();
    return Application.connection.post('/api/auth/signin/', user);
  },

  signout: function() {
    this.clear();
    this.clearCache();
  },

  isSignedIn: function() {
    return this.has('token') && this.get('token') !== '';
  },

  forgotPassword: function(email) {
    email = email || this.get('email');
    return Application.connection.post('/api/auth/forgot_password/', {email: email});
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
      }).updateCache();
    }

    return this;
  },

  canResetPassword: function() {
    var reset = this.get('passwordResetData');
    return this.isSignedIn() || (reset && reset.token && reset.type === 'PasswordReset');
  },

  resetPassword: function(password) {
    if (this.canResetPassword() && password) {
      return Application.connection.post('/api/auth/reset_password/', {
        token: this.get('passwordResetData').token,
        password: password
      });
    }
  }
});
