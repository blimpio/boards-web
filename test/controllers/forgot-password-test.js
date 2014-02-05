describe('ForgotPasswordController', function() {
  var ForgotPasswordController = require('controllers/forgot-password');
  var Connection = require('lib/connection');

  before(function() {
    jQuery.ajaxSetup({
      processData: false
    });

    this.Application = require('application');

    this.Application.connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });

    localStorage.setItem('User', '{"token": "1234567890"}');

    this.redirectSpy = sinon.spy(ForgotPasswordController.prototype, 'redirect');

    this.controller = new ForgotPasswordController();
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
    ForgotPasswordController.prototype.redirect.restore();
    this.controller.dispose();
    delete this.controller;
  });

  it('should exist.', function() {
    expect(this.controller).to.exist;
  });

  it('should have a name.', function() {
    expect(this.controller.name).to.equal('ForgotPasswordController');
  });

  describe('ForgotPasswordController.initialize', function() {
    it('should have initialized the user model.', function() {
      expect(this.controller.user).to.exist;
      expect(this.controller.user.name).to.equal('User');
      expect(this.controller.user.moduleName).to.equal('model');
    });

    it('should fetch the model from cache.', function() {
      expect(this.controller.user.hasFetched).to.be.true;
      expect(this.controller.user.get('token')).to.equal('1234567890');
    });

    it('should redirect to boards route if the user is logged in.', function() {
      this.controller.user.unset('token').updateCache();
      this.controller.initialize();
      expect(this.redirectSpy).to.have.been.calledOnce;
    });
  });

  describe('ForgotPasswordController.sendPasswordRecoveryEmail', function() {
    it('should send a password reset email.', function(done) {
      var url = '/api/auth/forgot_password/',
          contentType = {"Content-Type":"application/json"};

      this.controller.$email.val('elving.pr@gmail.com');

      this.server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, '{"email": "elving.pr@gmail.com"}');
      });

      this.controller.sendPasswordRecoveryEmail().done(function() {
        expect(this.controller.user.get('email')).to.equal('elving.pr@gmail.com');
        done();
      }.bind(this));

      this.server.respond();
    });
  });
});
