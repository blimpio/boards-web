describe('ForgotPasswordController', function() {
  var ForgotPasswordController = require('controllers/forgot-password');

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var forgotPasswordController;

    before(function() {
      forgotPasswordController = new ForgotPasswordController();
    });

    it('should exist.', function() {
      expect(forgotPasswordController).to.exist;
    });

    it('should have a name property.', function() {
      expect(forgotPasswordController.name).to.exist;
      expect(forgotPasswordController.name).to.equal('ForgotPasswordController');
    });

    it('should have a name template.', function() {
      expect(forgotPasswordController.template).to.exist;
    });

    it('should render and insert.', function() {
      expect(forgotPasswordController.isRendered).to.be.true;
      expect(forgotPasswordController.isInserted).to.be.true;
    });

    it('should have a form child view.', function() {
      expect(forgotPasswordController.children.form).to.exist;
    });

    after(function() {
      forgotPasswordController.unplug(true);
    });
  });

  describe('initChildren()', function() {
    var forgotPasswordController;

    before(function() {
      forgotPasswordController = new ForgotPasswordController();
    });

    it('should init the forgot password form view.', function() {
      forgotPasswordController.initChildren();
      expect(forgotPasswordController.children.form).to.exist;
    });

    after(function() {
      forgotPasswordController.unplug(true);
    });
  });
});
