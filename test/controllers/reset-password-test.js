describe('ResetPasswordController', function() {
  var ResetPasswordController = require('controllers/reset-password');

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var resetPasswordController;

    before(function() {
      resetPasswordController = new ResetPasswordController()
    });

    it('should exist.', function() {
      expect(resetPasswordController).to.exist;
    });

    it('should have a name property.', function() {
      expect(resetPasswordController.name).to.exist;
      expect(resetPasswordController.name).to.equal('ResetPasswordController');
    });

    it('should have a name template.', function() {
      expect(resetPasswordController.template).to.exist;
    });

    after(function() {
      resetPasswordController.unplug(true);
    });
  });

  describe('validateToken()', function() {
    var resetPasswordController;

    before(function() {
      resetPasswordController = new ResetPasswordController()
    });

    it('should set the password reset data from the url token and render the controller.', function() {
      resetPasswordController.validateToken(JWT_PASSWORD_TOKEN);
      expect(App.User.get('passwordResetData')).to.exist;
      expect(resetPasswordController.isRendered).to.be.true;
      expect(resetPasswordController.isInserted).to.be.true;
    });

    after(function() {
      resetPasswordController.unplug(true);
    });
  });

  describe('initChildren()', function() {
    var resetPasswordController;

    before(function() {
      resetPasswordController = new ResetPasswordController()
    });

    it('should init the form.', function() {
      resetPasswordController.initChildren();
      expect(resetPasswordController.children.form).to.exist;
    });

    after(function() {
      resetPasswordController.unplug(true);
    });
  });
});
