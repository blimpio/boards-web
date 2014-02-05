describe('ResetPasswordController', function() {
  var ResetPasswordController = require('controllers/reset-password');
  var Connection = require('lib/connection');

  before(function() {
    jQuery.ajaxSetup({
      processData: false
    });

    localStorage.setItem('User', '{"token": "1234567890"}');

    this.passToken = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0b2tlbl92ZXJzaW9uIjogIjRlMjMwM2IyLWIwYmEtNDA2OS05NzM2LTBlMDkzZDNmZTQ1NiIsICJ0eXBlIjogIlBhc3N3b3JkUmVzZXQiLCAiaWQiOiAyfQ.4JaqInkg-5p63cHQdJz1pfm7kfijinab9XK1h6jDk-Q';
    this.Application = require('application');

    this.Application.connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });

    this.redirectSpy = sinon.spy(ResetPasswordController.prototype, 'redirect');
    this.controller = new ResetPasswordController();
  });

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;
  });

  afterEach(function() {
    this.server.restore();
  });

  after(function() {
    ResetPasswordController.prototype.redirect.restore();
    this.controller.dispose();
    delete this.controller;
  });

  it('should exist.', function() {
    expect(this.controller).to.exist;
  });

  it('should have a name.', function() {
    expect(this.controller.name).to.equal('ResetPasswordController');
  });

  describe('ResetPasswordController.initialize', function() {
    it('should have initialized the user model.', function() {
      expect(this.controller.user).to.exist;
      expect(this.controller.user.name).to.equal('User');
      expect(this.controller.user.moduleName).to.equal('model');
    });

    it('should fetch the model from cache.', function() {
      expect(this.controller.user.hasFetched).to.be.true;
      expect(this.controller.user.get('token')).to.equal('1234567890');
    });
  });

  describe('ResetPasswordController.renderForm', function() {
    it('should render the reset password form.', function() {
      this.controller.renderForm();
      expect(this.controller.find('div.reset-password')).to.exist;
    });
  });

  describe('ResetPasswordController.validateToken', function() {
    it('should set password reset data from the url token.', function() {
      this.controller.validateToken({token: this.passToken});
      expect(this.controller.user.get('passwordResetData')).to.exist;
    });
  });

  describe('ResetPasswordController.resetPassword', function() {
    it('should request a password change.', function(done) {
      var url = '/api/auth/reset_password/',
          contentType = {"Content-Type":"application/json"};

      this.controller.$password.val('123456789');

      this.server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, '{"password_reset": true}');
      });

      this.controller.resetPassword().done(function() {
        expect(this.controller.user.has('passwordResetData')).to.be.false;
        done();
      }.bind(this));

      this.server.respond();
    });
  });
});
