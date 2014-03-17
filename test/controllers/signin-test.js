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
      expect(signinController._isRendered).to.be.true;
      expect(signinController._isInserted).to.be.true;
    });

    it('should have a form child view.', function() {
      expect(signinController.getView('form')).to.exist;
    });

    afterEach(function() {
      signinController.unplug(true);
    });
  });
});
