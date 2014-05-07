describe('UserModel', function() {
  var UserModel = require('models/user');

  describe('when instantiated.', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should exist.', function() {
      expect(userModel).to.exist;
    });

    it('should have a name property.', function() {
      expect(userModel.name).to.exist;
      expect(userModel.name).to.equal('User');
    });

    it('should have a name defaults.', function() {
      expect(userModel.defaults).to.exist;
      expect(userModel.defaults).to.eql({
        signup_step: 1,
        allow_signup: false
      });
    });

    it('should have a name localAttributes.', function() {
      expect(userModel.localAttributes).to.exist;
      expect(userModel.localAttributes).to.eql(['signup_step', 'passwordReset']);
    });

    it('should have a name validations.', function() {
      expect(userModel.validations).to.exist;
      expect(userModel.validations.username).to.exist;
      expect(userModel.validations.email).to.exist;
      expect(userModel.validations.password).to.exist;
      expect(userModel.validations.full_name).to.exist;
      expect(userModel.validations.account_name).to.exist;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('requestSignup()', function() {
    var server, userModel;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      userModel = new UserModel();
    });

    it('should make an HTTP request to /api/auth/signup_request/.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/signup_request/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "someuser@example.com"}');
        done();
      });

      userModel.requestSignup('someuser@example.com');
    });

    after(function() {
      server.restore();
      userModel.unplug();
    });
  });

  describe('onRequestSignupSuccess()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel();
    });

    it('should update the current signup step.', function() {
      userModel.onRequestSignupSuccess({email: 'someuser@example.com'});
      expect(userModel.get('email')).to.equal('someuser@example.com');
      expect(userModel.get('signup_step')).to.equal(2);
    });

    it('should trigger an user:signup-request:success event', function(done) {
      userModel.once('user:signup-request:success', function(){
        done();
      });

      userModel.onRequestSignupSuccess({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onRequestSignupError()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel();
    });

    it('should trigger an user:signup-request:error event.', function(done) {
      userModel.once('user:signup-request:error', function() {
        done();
      });

      userModel.onRequestSignupError({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('setEmailFromJWT()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel();
    });

    it('should set the email decoded from the given JWT.', function() {
      userModel.setEmailFromJWT(JWT_SIGNUP_TOKEN);
      expect(userModel.get('email')).to.equal('someuser@example.com');
      expect(userModel.get('signup_request_token')).to.equal(JWT_SIGNUP_TOKEN);
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('isWaitingForEmailValidation()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel();
    });

    it('should return false if the user is not waiting for the signup request email.', function() {
      expect(userModel.isWaitingForEmailValidation()).to.be.false;
    });

    it('should return true if the user is waiting for the signup request email.', function() {
      expect(userModel.isWaitingForEmailValidation()).to.be.false;
      userModel.setEmailFromJWT(JWT_SIGNUP_TOKEN).set('signup_step', 2);
      expect(userModel.isWaitingForEmailValidation()).to.be.true;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('updateSignupStep()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel();
    });

    it('should update the signup_step attribute and update the cache.', function() {
      userModel.updateSignupStep(1);
      expect(userModel.get('signup_step')).to.equal(1);
      expect(userModel.cache.get('signup_step')).to.equal(1);
      userModel.updateSignupStep(5);
      expect(userModel.get('signup_step')).to.equal(5);
      expect(userModel.cache.get('signup_step')).to.equal(5);
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('validateSignupEmailDomain()', function() {
    var server, userModel;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      userModel = new UserModel();
    });

    it('should make an HTTP request to /api/auth/signup_domains/validate/.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/signup_domains/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"signup_domains": "[example.com"]}');
        done();
      });

      userModel.validateSignupEmailDomain(['example.com']);
    });

    after(function() {
      server.restore();
      userModel.unplug();
    });
  });

  describe('onValidateSignupEmailDomainSuccess()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should update the current signup step.', function() {
      userModel.onValidateSignupEmailDomainSuccess({signup_domains: ['example.com']});
      expect(userModel.get('signup_step')).to.equal(7);
      expect(userModel.get('signup_domains')).to.eql(['example.com']);
    });

    it('should trigger an user:signup-domains:success event', function(done) {
      userModel.once('user:signup-domains:success', function(){
        done();
      });

      userModel.onValidateSignupEmailDomainSuccess({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onValidateSignupEmailDomainError()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:signup-domains:error event.', function(done) {
      userModel.once('user:signup-domains:error', function() {
        done();
      });

      userModel.onValidateSignupEmailDomainError({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('hasInviteDomains()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should return false if the user has not set any signup domains.', function() {
      expect(userModel.hasInviteDomains()).to.be.false;
    });

    it('should return true if the user set any signup domains.', function() {
      expect(userModel.hasInviteDomains()).to.be.false;
      userModel.set('signup_domains', ['blimp.io', 'getblimp.com'])
      expect(userModel.hasInviteDomains()).to.be.true;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('validateUsername()', function() {
    var server, userModel;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      userModel = new UserModel();
    });

    it('should make an HTTP request to /api/auth/username/validate/.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/username/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"username": "mctavish"}');
        done();
      });

      userModel.validateUsername('mctavish');
    });

    after(function() {
      server.restore();
      userModel.unplug();
    });
  });

  describe('onValidateUsernameSuccess()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should update the current signup step.', function() {
      userModel.onValidateUsernameSuccess({username: 'mctavish'});
      expect(userModel.get('username')).to.equal('mctavish');
      expect(userModel.get('signup_step')).to.equal(9);
    });

    it('should trigger an user:signup-username:success event', function(done) {
      userModel.once('user:signup-username:success', function(){
        done();
      });

      userModel.onValidateUsernameSuccess({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onValidateUsernameError()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:signup-username:error event.', function(done) {
      userModel.once('user:signup-username:error', function() {
        done();
      });

      userModel.onValidateUsernameError({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('signup()', function() {
    var server, userModel;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      userModel = new UserModel();
    });

    it('should make an HTTP request to /api/auth/signup/.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/signup/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
          email: 'someuser@example.com',
          token: '12345',
          username: 'mctavish'
        }));
        done();
      });

      userModel.signup();
    });

    after(function() {
      server.restore();
      userModel.unplug();
    });
  });

  describe('onSignupSuccess()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:signup:success event', function(done) {
      userModel.once('user:signup:success', function(){
        done();
      });

      userModel.onSignupSuccess({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onSignupError()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:signup:error event.', function(done) {
      userModel.once('user:signup:error', function() {
        done();
      });

      userModel.onSignupError({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('signin()', function() {
    var server, userModel;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      userModel = new UserModel();
    });

    it('should make an HTTP request to /api/auth/signin/.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/signin/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({
          email: 'someuser@example.com',
          token: '12345',
          username: 'mctavish',
          accounts: []
        }));
        done();
      });

      userModel.signin('mctavish', '12345678');
    });

    after(function() {
      server.restore();
      userModel.unplug();
    });
  });

  describe('signinFromCache()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should signin the user fetching data from cache.', function() {
      userModel.set('token', '12345');
      userModel.signinFromCache();
      expect(userModel.isSignedIn()).to.be.true;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onSigninSuccess()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:signin:success event', function(done) {
      userModel.once('user:signin:success', function(){
        done();
      });

      userModel.onSigninSuccess({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onSigninError()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:signin:error event.', function(done) {
      userModel.once('user:signin:error', function() {
        done();
      });

      userModel.onSigninError({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('isSignedIn()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should return false if the user is not signed in.', function() {
      expect(userModel.isSignedIn()).to.be.false;
    });

    it('should return true if the user is signed in.', function() {
      userModel.set('token', '12345');
      expect(userModel.isSignedIn()).to.be.true;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('signout()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should signout the user.', function() {
      userModel.set('token', '12345');
      userModel.signout();
      expect(userModel.attributes).to.be.empty;
      expect(userModel.isSignedIn()).to.be.false;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('forgotPassword()', function() {
    var server, userModel;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      userModel = new UserModel();
    });

    it('should make an HTTP request to /api/auth/forgot_password/.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/forgot_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      userModel.forgotPassword('someuser@example.com');
    });

    after(function() {
      server.restore();
      userModel.unplug();
    });
  });

  describe('onForgotPasswordSuccess()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:forgot-password:success event', function(done) {
      userModel.once('user:forgot-password:success', function(){
        done();
      });

      userModel.onForgotPasswordSuccess({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onForgotPasswordError()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:forgot-password:error event.', function(done) {
      userModel.once('user:forgot-password:error', function() {
        done();
      });

      userModel.onForgotPasswordError({});
    });

    after(function() {
      userModel.unplug();
    });
  });

 describe('setPasswordResetDataFromJWT()', function() {
  var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should set password reset data decoded from a JWT.', function() {
      userModel.setPasswordResetDataFromJWT(JWT_PASSWORD_TOKEN);
      expect(userModel.get('passwordResetData')).to.exist;
      expect(userModel.get('passwordResetData').id).to.exist;
      expect(userModel.get('passwordResetData').type).to.exist;
      expect(userModel.get('passwordResetData').token).to.exist;
      expect(userModel.get('passwordResetData').version).to.exist;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('canResetPassword()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should return false if the user has password no reset token.', function() {
      expect(userModel.canResetPassword()).to.be.false;
    });

    it('should return true if the user has a password reset token.', function() {
      userModel.setPasswordResetDataFromJWT(JWT_PASSWORD_TOKEN);
      expect(userModel.canResetPassword()).to.be.true;
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('resetPassword()', function() {
    var server, userModel;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      userModel = new UserModel();
    });

    it('should make an HTTP request to /api/auth/reset_password/.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/reset_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"token": "12345"}');
        done();
      });

      userModel.setPasswordResetDataFromJWT(JWT_PASSWORD_TOKEN);
      userModel.resetPassword('12345678');
    });

    after(function() {
      server.restore();
      userModel.unplug();
    });
  });

  describe('onResetPasswordSuccess()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:reset-password:success event', function(done) {
      userModel.once('user:reset-password:success', function(){
        done();
      });

      userModel.onResetPasswordSuccess({});
    });

    after(function() {
      userModel.unplug();
    });
  });

  describe('onResetPasswordError()', function() {
    var userModel;

    before(function() {
      userModel = new UserModel()
    });

    it('should trigger an user:reset-password:error event.', function(done) {
      userModel.once('user:reset-password:error', function() {
        done();
      });

      userModel.onResetPasswordError({});
    });

    after(function() {
      userModel.unplug();
    });
  });
});
