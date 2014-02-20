describe('ResetPasswordController', function() {
  var ResetPasswordController = require('controllers/reset-password');

  beforeEach(function() {
    this.ResetPasswordController = new ResetPasswordController();
  });

  afterEach(function() {
    this.ResetPasswordController.remove();
    delete this.ResetPasswordController;
  });

  it('should exist.', function() {
    expect(this.ResetPasswordController).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.ResetPasswordController.name).to.exist;
    expect(this.ResetPasswordController.name).to.equal('ResetPasswordController');
  });

  it('should have a name template.', function() {
    expect(this.ResetPasswordController.template).to.exist;
  });

  describe('renderForm', function() {
    it('should render and insert the controller.', function() {
      this.ResetPasswordController.renderForm();
      expect(this.ResetPasswordController.isRendered).to.be.true;
      expect(this.ResetPasswordController.isInserted).to.be.true;
    });
  });

  describe('validateToken', function() {
    it('should set the password reset data from the url token and render the controller.', function() {
      this.ResetPasswordController.validateToken(JWT_TEST_TOKEN);
      expect(this.ResetPasswordController.user.get('passwordResetData')).to.exist;
      expect(this.ResetPasswordController.isRendered).to.be.true;
      expect(this.ResetPasswordController.isInserted).to.be.true;
    });
  });

  describe('initForm', function() {
    it('should init the form.', function() {
      this.ResetPasswordController.initForm();
      expect(this.ResetPasswordController.children.form).to.exist;
    });
  });
});
