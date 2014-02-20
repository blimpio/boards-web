describe('ForgotPasswordController', function() {
  var ForgotPasswordController = require('controllers/forgot-password');

  beforeEach(function() {
    this.ForgotPasswordController = new ForgotPasswordController();
  });

  afterEach(function() {
    this.ForgotPasswordController.remove();
    delete this.ForgotPasswordController;
  });

  it('should exist.', function() {
    expect(this.ForgotPasswordController).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.ForgotPasswordController.name).to.exist;
    expect(this.ForgotPasswordController.name).to.equal('ForgotPasswordController');
  });

  it('should have a name template.', function() {
    expect(this.ForgotPasswordController.template).to.exist;
  });

  it('should render and insert.', function() {
    expect(this.ForgotPasswordController.isRendered).to.be.true;
    expect(this.ForgotPasswordController.isInserted).to.be.true;
  });

  it('should have a form child view.', function() {
    expect(this.ForgotPasswordController.children.form).to.exist;
  });

  describe('initForm', function() {
    it('should init the forgot password form view.', function() {
      this.ForgotPasswordController.initForm();
      expect(this.ForgotPasswordController.children.form).to.exist;
    });
  });
});
