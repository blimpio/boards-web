describe('SigninController', function() {
  var SigninController = require('controllers/signin');

  beforeEach(function() {
    this.SigninController = new SigninController();
  });

 afterEach(function() {
    this.SigninController.remove();
    delete this.SigninController;
  });

  it('should exist.', function() {
    expect(this.SigninController).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.SigninController.name).to.exist;
    expect(this.SigninController.name).to.equal('SigninController');
  });

  it('should have a template property.', function() {
    expect(this.SigninController.template).to.exist;
  });

  it('should render and insert.', function() {
    expect(this.SigninController.isRendered).to.be.true;
    expect(this.SigninController.isInserted).to.be.true;
  });

  it('should have a form child view.', function() {
    expect(this.SigninController.children.form).to.exist;
  });

  describe('initForm', function() {
    it('should init and render the signin form view.', function() {
      this.SigninController.initForm();
      expect(this.SigninController.children.form).to.exist;
      expect(this.SigninController.children.form.isRendered).to.be.true;
    });
  });
});
