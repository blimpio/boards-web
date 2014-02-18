describe('SigninController', function() {
  var controller,
      SigninController = require('controllers/signin');

  beforeEach(function() {
    controller = new SigninController();
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
    it('should init and render the signin form view.', function() {
      controller.initForm();
      expect(controller.children.form.name).to.equal('SigninForm');
      expect(controller.children.form.isRendered).to.be.true;
    });
  });
});
