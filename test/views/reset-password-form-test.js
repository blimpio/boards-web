describe('ResetPasswordForm', function() {
  var ResetPasswordForm = require('views/reset-password-form');

  before(function() {
    $('#application').html(require('templates/reset-password')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var resetPasswordForm;

    before(function() {
      resetPasswordForm = new ResetPasswordForm();
    });

    it('should exist.', function() {
      expect(resetPasswordForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(resetPasswordForm.name).to.exist;
      expect(resetPasswordForm.name).to.equal('ResetPasswordForm');
    });

    it('should have a bindings property.', function() {
      expect(resetPasswordForm.bindings).to.exist;
    });

    it('should have a formIsSet property.', function() {
      expect(resetPasswordForm.formIsSet).to.exist;
      expect(resetPasswordForm.formIsSet).to.be.true;
    });

    after(function() {
      resetPasswordForm.unplug(true);
    });
  });

  describe('onSubmit()', function() {
    var server, resetPasswordForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      resetPasswordForm = new ResetPasswordForm();
      resetPasswordForm.model.setPasswordResetDataFromJWT(JWT_PASSWORD_TOKEN);
      resetPasswordForm.render();
    });

    it('should call the resetPassword method on the user model if the given password is valid.', function(done) {
      server.respondWith('POST', '/api/auth/reset_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      resetPasswordForm.getAttributeElement('password').val('12345678');
      resetPasswordForm.onSubmit({preventDefault: function(){}});
    });

    after(function() {
      server.restore();
      resetPasswordForm.unplug(true);
    });
  });

  describe('onResetPasswordSuccess()', function() {
    var resetPasswordForm;

    before(function() {
      resetPasswordForm = new ResetPasswordForm();
      resetPasswordForm.render();
    });

    it('should render success message.', function() {
      resetPasswordForm.onResetPasswordSuccess();
      expect(resetPasswordForm.$('h3')).to.exist;
    });

    after(function() {
      resetPasswordForm.unplug(true);
    });
  });

  describe('onResetPasswordError()', function() {
    var resetPasswordForm;

    before(function() {
      resetPasswordForm = new ResetPasswordForm();
      resetPasswordForm.render();
    });

    it('should display an error message.', function() {
      resetPasswordForm.onResetPasswordError('error');
      expect(resetPasswordForm.getAttributeErrorElement('password').text()).to.equal('error');
    });

    after(function() {
      resetPasswordForm.unplug(true);
    });
  });
});
