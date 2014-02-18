describe('ForgotPasswordController', function() {
  var controller,
      ForgotPasswordController = require('controllers/forgot-password');

  beforeEach(function() {
    controller = new ForgotPasswordController();
  });

  afterEach(function() {
    controller.remove();
  });

  it('should exist.', function() {
    expect(controller).to.exist;
  });

  describe('initialize', function() {
    it('should render and insert.', function() {
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });

    it('should have a form child view.', function() {
      expect(controller.children.form).to.exist;
    });
  });

  describe('initForm', function() {
    it('should init the forgot password form view.', function() {
      controller.initForm();
      expect(controller.children.form.name).to.equal('ForgotPasswordForm');
    });
  });
});
