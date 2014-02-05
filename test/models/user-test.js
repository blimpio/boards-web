describe('UserModel', function() {
  var UserModel = require('models/user');
  var Connection = require('lib/connection');

  before(function() {
    this.token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAibmFtZUBleGFtcGxlLmNvbSJ9.PTbp7CGAJ3C4woorlCeWHRKqkcP7ZuiuWxn0FEiK9-0';
    this.passToken = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0b2tlbl92ZXJzaW9uIjogIjRlMjMwM2IyLWIwYmEtNDA2OS05NzM2LTBlMDkzZDNmZTQ1NiIsICJ0eXBlIjogIlBhc3N3b3JkUmVzZXQiLCAiaWQiOiAyfQ.4JaqInkg-5p63cHQdJz1pfm7kfijinab9XK1h6jDk-Q';

    this.user = new UserModel();
    this.Application = require('application');

    this.Application.connection = new Connection({
      type: 'HTTP',
      httpUrl: '/api/'
    });
  });

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;
  });

  afterEach(function() {
    this.user.clear();
    this.user.storage.clearAll();
    this.server.restore();
  });

  after(function() {
    this.user.clear();
    this.user.clearCache();
    delete this.user;
  });

  it('should exist.', function() {
    expect(this.user).to.exist;
  });

  it('should have a name.', function() {
    expect(this.user.name).to.equal('User');
  });

  it('should be cacheable.', function() {
    expect(this.user.cache).to.be.true;
  });

  describe('UserModel.requestSignup', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signup_request/',
          contentType = {"Content-Type":"application/json"};

      this.server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(this.user.requestSignup().promise).to.exist;
      this.server.respond();
    });
  });

  describe('UserModel.setEmailFromJWT', function() {
    it('should set the email decoded from the given JWT.', function() {
      this.user.setEmailFromJWT(this.token);
      expect(this.user.get('email')).to.equal('name@example.com');
      expect(this.user.get('signup_request_token')).to.equal(this.token);
    });
  });

  describe('UserModel.isWaitingForEmailValidation', function() {
    it('should check if the user is waiting for the signup request email.', function() {
      expect(this.user.isWaitingForEmailValidation()).to.be.false;
      this.user.setEmailFromJWT(this.token).set('signup_step', 2);
      expect(this.user.isWaitingForEmailValidation()).to.be.true;
    });
  });

  describe('UserModel.updateSignupStep', function() {
    it('should update the signup_step attribute and update the cache.', function() {
      this.user.updateSignupStep(1);
      expect(this.user.get('signup_step')).to.equal(1);
      expect(this.user.storage.get('signup_step')).to.equal(1);
      this.user.updateSignupStep(5);
      expect(this.user.get('signup_step')).to.equal(5);
      expect(this.user.storage.get('signup_step')).to.equal(5);
    });
  });

  describe('UserModel.validateSignupEmailDomain', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signup_domains/validate/',
          contentType = {"Content-Type":"application/json"};

      this.server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(this.user.validateSignupEmailDomain().promise).to.exist;
      this.server.respond();
    });
  });

  describe('UserModel.hasInviteDomains', function() {
    it('should check if the user set any signup domains.', function() {
      expect(this.user.hasInviteDomains()).to.be.false;
      this.user.set('signup_domains', ['blimp.io', 'getblimp.com'])
      expect(this.user.hasInviteDomains()).to.be.true;
    });
  });

  describe('UserModel.validateUsername', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/username/validate/',
          contentType = {"Content-Type":"application/json"};

      this.server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(this.user.validateUsername().promise).to.exist;
      this.server.respond();
    });
  });

  describe('UserModel.signup', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signup/',
          contentType = {"Content-Type":"application/json"};

      this.server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(this.user.signup().promise).to.exist;
      this.server.respond();
    });
  });

  describe('UserModel.isSignedIn', function() {
    it('should return true when the user is logged in.', function() {
      this.user.set({token: '123456789098765432'});
      expect(this.user.isSignedIn()).to.be.true;
    });

    it('should return false when the user is not logged in.', function() {
      this.user.unset('token');
      expect(this.user.isSignedIn()).to.be.false;
    });
  });

  describe('UserModel.signin', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signin/',
          contentType = {"Content-Type":"application/json"};

      this.server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(this.user.signin().promise).to.exist;
      this.server.respond();
    });
  });

  describe('UserModel.signout', function() {
    it('should signout the user.', function() {
      this.user.set({
        email: 'email@example.com',
        username: 'fulano',
        token: '1234567890'
      }).updateCache();

      expect(this.user.has('email')).to.be.true;
      expect(this.user.has('username')).to.be.true;
      expect(this.user.has('token')).to.be.true;
      expect(this.user.storage.get('token')).to.exist;

      this.user.signout();

      expect(this.user.has('email')).to.be.false;
      expect(this.user.has('username')).to.be.false;
      expect(this.user.has('token')).to.be.false;
      expect(this.user.storage.get('token')).to.not.exist;
    });
  });

  describe('UserModel.forgotPassword', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/forgot_password/',
          contentType = {"Content-Type":"application/json"};

      this.server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(this.user.forgotPassword().promise).to.exist;
      this.server.respond();
    });
  });

  describe('UserModel.setPasswordResetDataFromJWT', function() {
    it('should set password reset data decoded from a JWT.', function() {
      this.user.setPasswordResetDataFromJWT(this.passToken);
      expect(this.user.get('passwordResetData')).to.exist;
      expect(this.user.get('passwordResetData').id).to.exist;
      expect(this.user.get('passwordResetData').type).to.exist;
      expect(this.user.get('passwordResetData').token).to.exist;
      expect(this.user.get('passwordResetData').version).to.exist;
    });
  });

  describe('UserModel.canResetPassword', function() {
    it('should return false if the user is not logged in.', function() {
      this.user.clear().clearCache();
      expect(this.user.canResetPassword()).to.not.be.ok;
    });

    it('should return true if the user is logged in.', function() {
      this.user.clear().clearCache();
      this.user.set('token', this.token);
      expect(this.user.canResetPassword()).to.be.true;
    });

    it('should return true if the user has password reset token.', function() {
      this.user.clear().clearCache();
      this.user.setPasswordResetDataFromJWT(this.passToken);
      expect(this.user.canResetPassword()).to.be.true;
    });
  });

  describe('UserModel.resetPassword', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/forgot_password/',
          contentType = {"Content-Type":"application/json"};

      this.server.respondWith('POST', url, [200, contentType, 'OK']);
      this.user.setPasswordResetDataFromJWT(this.passToken);
      expect(this.user.resetPassword('password1').promise).to.exist;
      this.server.respond();
    });
  });
});
