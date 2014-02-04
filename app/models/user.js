module.exports = Zeppelin.Model.extend({
  name: 'User',

  cache: true,

  defaults: {
    signup_step: 1
  },

  validations: {
    email: [{
      required: true,
      message: 'An email is required to authenticate you.'
    }, {
      isEmail: true,
      message: 'Provide a valid email.'
    }]
  },

  localAttributes: ['name', 'signup_step'],

  requestSignup: function() {
    return Application.connection.post('/api/auth/signup_request/', {
      email: this.get('email')
    });
  },

  setEmailFromJWT: function(token) {
    token = token || '';
    token = token.replace(/^=/, '');

    var tokenData = _.decodeJWT(token);

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

  isLoggedIn: function() {
    return this.has('token') && this.get('token') !== '';
  }
});
