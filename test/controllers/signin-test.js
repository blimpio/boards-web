describe('SigninController', function() {
  var SigninController = require('controllers/signin');

  afterEach(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var signinController;

    beforeEach(function() {
      signinController = new SigninController()
    });

    it('should exist.', function() {
      expect(signinController).to.exist;
    });

    it('should have a name property.', function() {
      expect(signinController.name).to.exist;
      expect(signinController.name).to.equal('SigninController');
    });

    it('should have a template property.', function() {
      expect(signinController.template).to.exist;
    });

    it('should render and insert.', function() {
      expect(signinController.isRendered).to.be.true;
      expect(signinController.isInserted).to.be.true;
    });

    it('should have a form child view.', function() {
      expect(signinController.children.form).to.exist;
    });

    afterEach(function() {
      signinController.unplug(true);
    });
  });

  describe('initChildren()', function() {
    var signinController;

    beforeEach(function() {
      signinController = new SigninController()
    });

    it('should init and render the signin form view.', function() {
      signinController.initChildren();
      expect(signinController.children.form).to.exist;
      expect(signinController.children.form.isRendered).to.be.true;
    });

    afterEach(function() {
      signinController.unplug(true);
    });
  });
});
