describe('UserModel', function() {
  var UserModel = require('models/user');

  before(function() {
    this.token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAibmFtZUBleGFtcGxlLmNvbSJ9.PTbp7CGAJ3C4woorlCeWHRKqkcP7ZuiuWxn0FEiK9-0';
    this.passwordToken = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0b2tlbl92ZXJzaW9uIjogIjRlMjMwM2IyLWIwYmEtNDA2OS05NzM2LTBlMDkzZDNmZTQ1NiIsICJ0eXBlIjogIlBhc3N3b3JkUmVzZXQiLCAiaWQiOiAyfQ.4JaqInkg-5p63cHQdJz1pfm7kfijinab9XK1h6jDk-Q';
  });

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.UserModel = new UserModel();
  });

  afterEach(function() {
    this.server.restore();
    delete this.server;
    this.UserModel.clear();
    this.UserModel.destroyCache();
    this.UserModel.stopListening();
    delete this.UserModel;
  });

  it('should exist.', function() {
    expect(this.UserModel).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.UserModel.name).to.exist;
    expect(this.UserModel.name).to.equal('User');
  });

  it('should have a name defaults.', function() {
    expect(this.UserModel.defaults).to.exist;
    expect(this.UserModel.defaults).to.eql({signup_step: 1});
  });

  it('should have a name localAttributes.', function() {
    expect(this.UserModel.localAttributes).to.exist;
    expect(this.UserModel.localAttributes).to.eql(['signup_step', 'passwordReset']);
  });

  it('should have a name validations.', function() {
    expect(this.UserModel.validations).to.exist;
    expect(this.UserModel.validations.username).to.exist;
    expect(this.UserModel.validations.email).to.exist;
    expect(this.UserModel.validations.password).to.exist;
    expect(this.UserModel.validations.full_name).to.exist;
    expect(this.UserModel.validations.account_name).to.exist;
  });

  describe('requestSignup', function() {
    it('should make an HTTP request to /api/auth/signup_request/.', function(done) {
      this.server.respondWith('POST', '/api/auth/signup_request/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      this.UserModel.requestSignup('name@example.com');
      this.server.respond();
    });
  });

  describe('onRequestSignupSuccess', function() {
    it('should update the current signup step.', function() {
      this.UserModel.onRequestSignupSuccess({email: 'name@example.com'});
      expect(this.UserModel.get('email')).to.equal('name@example.com');
      expect(this.UserModel.get('signup_step')).to.equal(2);
    });

    it('should trigger an user:signup-request:success event', function(done) {
      this.UserModel.once('user:signup-request:success', function(){
        done();
      });

      this.UserModel.onRequestSignupSuccess({});
    });
  });

  describe('onRequestSignupError', function() {
    it('should trigger an user:signup-request:error event.', function(done) {
      this.UserModel.once('user:signup-request:error', function() {
        done();
      });

      this.UserModel.onRequestSignupError({});
    });
  });

  describe('setEmailFromJWT', function() {
    it('should set the email decoded from the given JWT.', function() {
      this.UserModel.setEmailFromJWT(this.token);
      expect(this.UserModel.get('email')).to.equal('name@example.com');
      expect(this.UserModel.get('signup_request_token')).to.equal(this.token);
    });
  });

  describe('isWaitingForEmailValidation', function() {
    it('should return false if the user is not waiting for the signup request email.', function() {
      expect(this.UserModel.isWaitingForEmailValidation()).to.be.false;
    });

    it('should return true if the user is waiting for the signup request email.', function() {
      expect(this.UserModel.isWaitingForEmailValidation()).to.be.false;
      this.UserModel.setEmailFromJWT(this.token).set('signup_step', 2);
      expect(this.UserModel.isWaitingForEmailValidation()).to.be.true;
    });
  });

  describe('updateSignupStep', function() {
    it('should update the signup_step attribute and update the cache.', function() {
      this.UserModel.updateSignupStep(1);
      expect(this.UserModel.get('signup_step')).to.equal(1);
      expect(this.UserModel.cache.get('signup_step')).to.equal(1);
      this.UserModel.updateSignupStep(5);
      expect(this.UserModel.get('signup_step')).to.equal(5);
      expect(this.UserModel.cache.get('signup_step')).to.equal(5);
    });
  });

  describe('validateSignupEmailDomain', function() {
    it('should make an HTTP request to /api/auth/signup_domains/validate/.', function(done) {

      this.server.respondWith('POST', '/api/auth/signup_domains/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"signup_domains": "[example.com"]}');
        done();
      });

      this.UserModel.validateSignupEmailDomain(['example.com']);
      this.server.respond();
    });
  });

  describe('onValidateSignupEmailDomainSuccess', function() {
    it('should update the current signup step.', function() {
      this.UserModel.onValidateSignupEmailDomainSuccess({signup_domains: ['example.com']});
      expect(this.UserModel.get('signup_step')).to.equal(7);
      expect(this.UserModel.get('signup_domains')).to.eql(['example.com']);
    });

    it('should trigger an user:signup-domains:success event', function(done) {
      this.UserModel.once('user:signup-domains:success', function(){
        done();
      });

      this.UserModel.onValidateSignupEmailDomainSuccess({});
    });
  });

  describe('onValidateSignupEmailDomainError', function() {
    it('should trigger an user:signup-domains:error event.', function(done) {
      this.UserModel.once('user:signup-domains:error', function() {
        done();
      });

      this.UserModel.onValidateSignupEmailDomainError({});
    });
  });

  describe('hasInviteDomains', function() {
    it('should return false if the user has not set any signup domains.', function() {
      expect(this.UserModel.hasInviteDomains()).to.be.false;
    });

    it('should return true if the user set any signup domains.', function() {
      expect(this.UserModel.hasInviteDomains()).to.be.false;
      this.UserModel.set('signup_domains', ['blimp.io', 'getblimp.com'])
      expect(this.UserModel.hasInviteDomains()).to.be.true;
    });
  });

  describe('validateUsername', function() {
    it('should make an HTTP request to /api/auth/username/validate/.', function(done) {
      this.server.respondWith('POST', '/api/auth/username/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"username": "mctavish"}');
        done();
      });

      this.UserModel.validateUsername('mctavish');
      this.server.respond();
    });
  });

  describe('onValidateUsernameSuccess', function() {
    it('should update the current signup step.', function() {
      this.UserModel.onValidateUsernameSuccess({username: 'mctavish'});
      expect(this.UserModel.get('username')).to.equal('mctavish');
      expect(this.UserModel.get('signup_step')).to.equal(9);
    });

    it('should trigger an user:signup-username:success event', function(done) {
      this.UserModel.once('user:signup-username:success', function(){
        done();
      });

      this.UserModel.onValidateUsernameSuccess({});
    });
  });

  describe('onValidateUsernameError', function() {
    it('should trigger an user:signup-username:error event.', function(done) {
      this.UserModel.once('user:signup-username:error', function() {
        done();
      });

      this.UserModel.onValidateUsernameError({});
    });
  });

  describe('signup', function() {
    it('should make an HTTP request to /api/auth/signup/.', function(done) {
      this.server.respondWith('POST', '/api/auth/signup/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
          email: 'name@example.com',
          token: '12345',
          username: 'mctavish'
        }));
        done();
      });

      this.UserModel.signup();
      this.server.respond();
    });
  });

  describe('onSignupSuccess', function() {
    it('should trigger an user:signup:success event', function(done) {
      this.UserModel.once('user:signup:success', function(){
        done();
      });

      this.UserModel.onSignupSuccess({});
    });
  });

  describe('onSignupError', function() {
    it('should trigger an user:signup:error event.', function(done) {
      this.UserModel.once('user:signup:error', function() {
        done();
      });

      this.UserModel.onSignupError({});
    });
  });

  describe('signin', function() {
    it('should make an HTTP request to /api/auth/signin/.', function(done) {
      this.server.respondWith('POST', '/api/auth/signin/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
          email: 'name@example.com',
          token: '12345',
          username: 'mctavish',
          accounts: []
        }));
        done();
      });

      this.UserModel.signin('mctavish', '12345678');
      this.server.respond();
    });
  });

  describe('signinFromCache', function() {
    it('should signin the user fetching data from cache.', function() {
      this.UserModel.set('token', '12345');
      this.UserModel.signinFromCache();
      expect(this.UserModel.isSignedIn()).to.be.true;
    });
  });

  describe('onSigninSuccess', function() {
    it('should trigger an user:signin:success event', function(done) {
      this.UserModel.once('user:signin:success', function(){
        done();
      });

      this.UserModel.onSigninSuccess({});
    });
  });

  describe('onSigninError', function() {
    it('should trigger an user:signin:error event.', function(done) {
      this.UserModel.once('user:signin:error', function() {
        done();
      });

      this.UserModel.onSigninError({});
    });
  });

  describe('isSignedIn', function() {
    it('should return false if the user is not signed in.', function() {
      expect(this.UserModel.isSignedIn()).to.be.false;
    });

    it('should return true if the user is signed in.', function() {
      this.UserModel.set('token', '12345');
      expect(this.UserModel.isSignedIn()).to.be.true;
    });
  });

  describe('signout', function() {
    it('should signout the user.', function() {
      this.UserModel.set('token', '12345');
      this.UserModel.signout();
      expect(this.UserModel.attributes).to.be.empty;
      expect(this.UserModel.isSignedIn()).to.be.false;
    });
  });

  describe('forgotPassword', function() {
    it('should make an HTTP request to /api/auth/forgot_password/.', function(done) {
      this.server.respondWith('POST', '/api/auth/forgot_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      this.UserModel.forgotPassword('name@example.com');
      this.server.respond();
    });
  });

  describe('onForgotPasswordSuccess', function() {
    it('should trigger an user:forgot-password:success event', function(done) {
      this.UserModel.once('user:forgot-password:success', function(){
        done();
      });

      this.UserModel.onForgotPasswordSuccess({});
    });
  });

  describe('onForgotPasswordError', function() {
    it('should trigger an user:forgot-password:error event.', function(done) {
      this.UserModel.once('user:forgot-password:error', function() {
        done();
      });

      this.UserModel.onForgotPasswordError({});
    });
  });

 describe('setPasswordResetDataFromJWT', function() {
    it('should set password reset data decoded from a JWT.', function() {
      this.UserModel.setPasswordResetDataFromJWT(this.passwordToken);
      expect(this.UserModel.get('passwordResetData')).to.exist;
      expect(this.UserModel.get('passwordResetData').id).to.exist;
      expect(this.UserModel.get('passwordResetData').type).to.exist;
      expect(this.UserModel.get('passwordResetData').token).to.exist;
      expect(this.UserModel.get('passwordResetData').version).to.exist;
    });
  });

  describe('canResetPassword', function() {
    it('should return false if the user has password no reset token.', function() {
      expect(this.UserModel.canResetPassword()).to.not.be.ok;
    });

    it('should return true if the user has a password reset token.', function() {
      this.UserModel.setPasswordResetDataFromJWT(this.passwordToken);
      expect(this.UserModel.canResetPassword()).to.be.true;
    });
  });

  describe('resetPassword', function() {
    it('should make an HTTP request to /api/auth/reset_password/.', function(done) {
      this.server.respondWith('POST', '/api/auth/reset_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"token": "12345"}');
        done();
      });

      this.UserModel.setPasswordResetDataFromJWT(this.passwordToken);
      this.UserModel.resetPassword('12345678');
      this.server.respond();
    });
  });

  describe('onResetPasswordSuccess', function() {
    it('should trigger an user:reset-password:success event', function(done) {
      this.UserModel.once('user:reset-password:success', function(){
        done();
      });

      this.UserModel.onResetPasswordSuccess({});
    });
  });

  describe('onResetPasswordError', function() {
    it('should trigger an user:reset-password:error event.', function(done) {
      this.UserModel.once('user:reset-password:error', function() {
        done();
      });

      this.UserModel.onResetPasswordError({});
    });
  });
});
