module.exports = Zeppelin.Model.extend({
  name: 'User',

  defaults: {
    is_invite: false,
    signup_step: 1,
    allow_signup: false
  },

  localAttributes: ['signup_step', 'passwordReset', 'is_invite'],

  validations: {
    username: [{
      isEmpty: false,
      message: 'A username is required to authenticate you.'
    }, {
      isAlphanumeric: true,
      message: 'Your username must be an alphanumeric value.'
    }],

    email: [{
      isEmpty: false,
      message: 'An email is required to authenticate you.'
    }, {
      isEmail: true,
      message: 'Provide a valid email.'
    }],

    password: [{
      isEmpty: false,
      message: 'A password is required to authenticate you.'
    }, {
      isOfMinimumLength: 6,
      message: 'Your password must have a minimun of 6 characters.'
    }],

    full_name: [{
      isEmpty: false,
      message: 'Your name is required to authenticate you.'
    }, function(name) {
      if (!name.split(' ')[1]) return 'Your full name is required to authenticate you.';
    }],

    account_name: function(account) {
      if (!this.get('is_invite') && !account) {
        return 'An account name is required to authenticate you.';
      }
    }
  },

  requestSignup: function(email) {
    email = JSON.stringify({email: email || this.get('email')});

    $.post('/api/auth/signup_request/', email)
      .done(this.onRequestSignupSuccess.bind(this))
      .fail(this.onRequestSignupError.bind(this));

    return this;
  },

  onRequestSignupSuccess: function(response) {
    this.set(response).updateSignupStep(2);
    this.trigger('user:signup-request:success', this.attributes);
    return this;
  },

  onRequestSignupError: function(error) {
    error = error.responseJSON ? error.responseJSON.error : error;
    error = error.email ? error.email[0] : 'An error ocurred.';
    this.trigger('user:signup-request:error', error);
    return this;
  },

  setEmailFromJWT: function(token) {
    var tokenData;

    token = token || '';
    token = token.replace(/^=/, '');
    tokenData = _.decodeJWT(token);

    if (tokenData.email) this.set({
      'email': tokenData.email,
      'signup_request_token': token
    });

    return this;
  },

  setEmailFromInviteJWT: function(token) {
    var tokenData;

    token = token || '';
    token = token.replace(/^=/, '');
    tokenData = _.decodeJWT(token);

    if (tokenData.email) this.set({
      'email': tokenData.email,
      'invited_user_token': token
    });

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
    domains = JSON.stringify({signup_domains: domains});

    if (!domains) {
      this.onValidateSignupEmailDomainError({signup_domains: ['Provide a valid domain name.']});
    } else {
      $.post('/api/auth/signup_domains/validate/', domains)
        .done(this.onValidateSignupEmailDomainSuccess.bind(this))
        .fail(this.onValidateSignupEmailDomainError.bind(this));
    }

    return this;
  },

  onValidateSignupEmailDomainSuccess: function(response) {
    this.set(response).updateSignupStep(7);
    this.trigger('user:signup-domains:success', this.attributes);
    return this;
  },

  onValidateSignupEmailDomainError: function(error) {
    error = error.responseJSON ? error.responseJSON.error : error;
    error = error.signup_domains ? error.signup_domains[0] : 'An error ocurred.';
    this.trigger('user:signup-domains:error', error);
    return this;
  },

  hasInviteDomains: function() {
    return this.has('signup_domains') && this.get('signup_domains').length > 0;
  },

  validateUsername: function(username) {
    username = JSON.stringify({username: username || this.get('username')});

    $.post('/api/auth/username/validate/', username)
      .done(this.onValidateUsernameSuccess.bind(this))
      .fail(this.onValidateUsernameError.bind(this));

    return this;
  },

  onValidateUsernameSuccess: function(response) {
    this.set(response).updateSignupStep(9);
    this.trigger('user:signup-username:success', this.attributes);
    return this;
  },

  onValidateUsernameError: function(error) {
    error = error.responseJSON ? error.responseJSON.error : error;
    error = error.username ? error.username[0] : 'An error ocurred.';
    this.trigger('user:signup-username:error', error);
    return this;
  },

  signup: function(credentials) {
    credentials = JSON.stringify(credentials || this.toJSON());

    $.post('/api/auth/signup/', credentials)
      .done(this.onSignupSuccess.bind(this))
      .fail(this.onSignupError.bind(this));

    return this;
  },

  onSignupSuccess: function(response) {
    this.set(response)
      .unset('password', {silent: true})
      .unset('signup_step', {silent: true})
      .unset('signup_request_token', {silent: true})
      .saveCache();

    this.publish('user:signup:success', this.attributes);
    return this;
  },

  onSignupError: function(error) {
    error = error.responseJSON ? error.responseJSON.error : error;
    error = error.email || error.username || error.password;
    error = error ? error[0] : 'An error ocurred.';
    this.publish('user:signup:error', error);
    return this;
  },

  signin: function(username, password) {
    var credentials = {};

    if (username && password) {
      credentials.username = username;
      credentials.password = password;
    } else if (this.get('username') && this.get('password')) {
      credentials.username = this.get('username');
      credentials.password = this.get('password');
    }

    if (!_.size(credentials)) this.onSigninError({
      username: ['Credentials are required to signin.'],
      password: ['Credentials are required to signin.']
    });

    credentials = JSON.stringify(credentials);

    $.post('/api/auth/signin/', credentials)
      .done(this.onSigninSuccess.bind(this))
      .fail(this.onSigninError.bind(this));

    return this;
  },

  signinFromCache: function() {
    this.fetchCache();
    if (this.isSignedIn()) this.onSigninSuccess();
    return this;
  },

  onSigninSuccess: function(response) {
    this.unset('password').set(response).saveCache();
    this.publish('user:signin:success', this.attributes);
    return this;
  },

  onSigninError: function(error) {
    error = error.responseJSON ? error.responseJSON.error : error;
    if (error.email) error = {email: error.email[0] || 'An error ocurred.'};
    if (error.password) error = {password: error.password[0] || 'An error ocurred.'};
    this.publish('user:signin:error', error);
    return this;
  },

  isSignedIn: function() {
    return this.has('token');
  },

  signout: function() {
    this.clear();
    this.destroyCache();
    return this;
  },

  forgotPassword: function(email) {
    email = JSON.stringify({email: email || this.get('email')});

    $.post('/api/auth/forgot_password/', email)
      .done(this.onForgotPasswordSuccess.bind(this))
      .fail(this.onForgotPasswordError.bind(this));

    return this;
  },

  onForgotPasswordSuccess: function(response) {
    this.set(response).saveCache();
    this.trigger('user:forgot-password:success', this.attributes);
    return this;
  },

  onForgotPasswordError: function(error) {
    error = error.responseJSON ? error.responseJSON.error : error;
    error = error.email ? error.email[0] : 'An error ocurred';
    this.trigger('user:forgot-password:error', error);
    return this;
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

    if (reset && reset.token && reset.type === 'PasswordReset') {
      return true;
    } else {
      return false;
    }
  },

  resetPassword: function(password) {
    var token = this.has('passwordResetData') ? this.get('passwordResetData').token : token;

    data = JSON.stringify({
      token: token,
      password: password || this.get('password')
    });

    if (this.canResetPassword()) {
      $.post('/api/auth/reset_password/', data)
        .done(this.onResetPasswordSuccess.bind(this))
        .fail(this.onResetPasswordError.bind(this));
    } else {
      this.onResetPasswordError({token: ['A valid token is required to reset your password.']})
    }

    return this;
  },

  onResetPasswordSuccess: function(response) {
    this.unset('passwordResetData').destroyCache();
    this.trigger('user:reset-password:success', this.attributes);
    return this;
  },

  onResetPasswordError: function(error) {
    error = error.responseJSON ? error.responseJSON.error : error;
    error = error.token || error.password;
    error = error ? error[0] : 'An error ocurred';
    this.trigger('user:reset-password:error', error);
    return this;
  }
});
