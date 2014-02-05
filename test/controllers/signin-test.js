describe('SigninController', function() {
  var SigninController = require('controllers/signin');

  before(function() {
    localStorage.setItem('User', '{"token": "1234567890"}');

    this.redirectSpy = sinon.spy(SigninController.prototype, 'redirect');

    this.controller = new SigninController();
  });

  after(function() {
    SigninController.prototype.redirect.restore();
    this.controller.dispose();
    delete this.controller;
  });

  it('should exist.', function() {
    expect(this.controller).to.exist;
  });

  it('should have a name.', function() {
    expect(this.controller.name).to.equal('SigninController');
  });

  describe('SigninController.initialize', function() {
    it('should have initialized the user model.', function() {
      expect(this.controller.user).to.exist;
      expect(this.controller.user.name).to.equal('User');
      expect(this.controller.user.moduleName).to.equal('model');
    });

    it('should fetch the model from cache.', function() {
      expect(this.controller.user.hasFetched).to.be.true;
      expect(this.controller.user.get('token')).to.equal('1234567890');
    });

    it('should redirect to boards route if the user is logged in.', function() {
      this.controller.user.unset('token').updateCache();
      this.controller.initialize();
      expect(this.redirectSpy).to.have.been.calledOnce;
    });
  });

  describe('SigninController.afterInserted', function() {
    it('should have initialized the signin-form view.', function() {
      expect(this.controller.signinForm).to.exist;
      expect(this.controller.signinForm.name).to.equal('SigninForm');
      expect(this.controller.signinForm.moduleName).to.equal('formView');
    });
  });
});
