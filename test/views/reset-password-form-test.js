describe('ResetPasswordForm', function() {
  var ResetPasswordForm = require('views/reset-password-form');

  beforeEach(function() {
    $('#application').html(require('templates/reset-password')());

    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.ResetPasswordForm = new ResetPasswordForm({
      model: _.getModel('User')
    });

    this.ResetPasswordForm.render();
  });

  afterEach(function() {
    this.server.restore();
    delete this.server;
    this.ResetPasswordForm.remove();
    delete this.ResetPasswordForm;
  });

  it('should exist.', function() {
    expect(this.ResetPasswordForm).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.ResetPasswordForm.name).to.exist;
    expect(this.ResetPasswordForm.name).to.equal('ResetPasswordForm');
  });

  it('should have a bindings property.', function() {
    expect(this.ResetPasswordForm.bindings).to.exist;
  });

  it('should have a formIsSet property.', function() {
    expect(this.ResetPasswordForm.formIsSet).to.exist;
    expect(this.ResetPasswordForm.formIsSet).to.be.true;
  });

  describe('onSubmit', function() {
    it('should call the resetPassword method on the user model if the given password is valid.', function(done) {
      this.server.respondWith('POST', '/api/auth/reset_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      this.ResetPasswordForm.getAttributeElement('password').val('12345678');
      this.ResetPasswordForm.onSubmit({preventDefault: function(){}});
      this.server.respond();
    });
  });

  describe('onResetPasswordSuccess', function() {
    it('should render success message.', function() {
      this.ResetPasswordForm.onResetPasswordSuccess();
      expect(this.ResetPasswordForm.$('h3')).to.exist;
    });
  });

  describe('onResetPasswordError', function() {
    it('should display an error message.', function() {
      this.ResetPasswordForm.onResetPasswordError('error');
      expect(this.ResetPasswordForm.getAttributeErrorElement('password').text()).to.equal('error');
    });
  });
});
