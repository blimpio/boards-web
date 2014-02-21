describe('ForgotPasswordForm', function() {
  var ForgotPasswordForm = require('views/forgot-password-form');

  beforeEach(function() {
    $('#application').html(require('templates/forgot-password')());

    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.ForgotPasswordForm = new ForgotPasswordForm({
      model: Boards.User
    });

    this.ForgotPasswordForm.render();
  });

  afterEach(function() {
    this.server.restore();
    delete this.server;
    this.ForgotPasswordForm.remove();
    delete this.ForgotPasswordForm;
  });

  it('should exist.', function() {
    expect(this.ForgotPasswordForm).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.ForgotPasswordForm.name).to.exist;
    expect(this.ForgotPasswordForm.name).to.equal('ForgotPasswordForm');
  });

  it('should have a bindings property.', function() {
    expect(this.ForgotPasswordForm.bindings).to.exist;
  });

  it('should have a formIsSet property.', function() {
    expect(this.ForgotPasswordForm.formIsSet).to.exist;
    expect(this.ForgotPasswordForm.formIsSet).to.be.true;
  });

  describe('onSubmit', function() {
    it('should call the forgotPassword method on the user model if the given email is valid.', function(done) {
      this.server.respondWith('POST', '/api/auth/forgot_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      this.ForgotPasswordForm.getAttributeElement('email').val('name@example.com');
      this.ForgotPasswordForm.onSubmit({preventDefault: function(){}});
      this.server.respond();
    });
  });

  describe('onForgotPasswordSuccess', function() {
    it('should render success message.', function() {
      this.ForgotPasswordForm.onForgotPasswordSuccess();
      expect(this.ForgotPasswordForm.$('h3')).to.exist;
    });
  });

  describe('onForgotPasswordError', function() {
    it('should display an error message.', function() {
      this.ForgotPasswordForm.onForgotPasswordError('error');
      expect(this.ForgotPasswordForm.getAttributeErrorElement('email').text()).to.equal('error');
    });
  });
});
