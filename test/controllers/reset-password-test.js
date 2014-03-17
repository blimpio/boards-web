describe('ResetPasswordController', function() {
  var ResetPasswordController = require('controllers/reset-password');

  afterEach(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var resetPasswordController;

    beforeEach(function() {
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

    it('should have child views.', function() {
      expect(resetPasswordController.getView('form')).to.exist;
    });

    afterEach(function() {
      resetPasswordController.unplug(true);
    });
  });

  describe('validateToken()', function() {
    var resetPasswordController;

    beforeEach(function() {
      resetPasswordController = new ResetPasswordController()
    });

    it('should set the password reset data from the url token and render the controller.', function() {
      resetPasswordController.validateToken(JWT_PASSWORD_TOKEN);
      expect(App.User.get('passwordResetData')).to.exist;
      expect(resetPasswordController._isRendered).to.be.true;
      expect(resetPasswordController._isInserted).to.be.true;
    });

    afterEach(function() {
      resetPasswordController.unplug(true);
    });
  });
});
