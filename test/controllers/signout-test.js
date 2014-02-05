describe('SignoutController', function() {
  var SignoutController = require('controllers/signout');

  before(function() {
    localStorage.setItem('User', '{"token": "1234567890"}');

    this.redirectSpy = sinon.spy(SignoutController.prototype, 'redirect');

    this.controller = new SignoutController();
  });

  after(function() {
    SignoutController.prototype.redirect.restore();
    this.controller.dispose();
    delete this.controller;
  });

  it('should exist.', function() {
    expect(this.controller).to.exist;
  });

  it('should have a name.', function() {
    expect(this.controller.name).to.equal('SignoutController');
  });

  describe('SignoutController.initialize', function() {
    it('should have initialized the user model.', function() {
      expect(this.controller.user).to.exist;
      expect(this.controller.user.name).to.equal('User');
      expect(this.controller.user.moduleName).to.equal('model');
    });

    it('should redirect to login.', function() {
      expect(this.redirectSpy).to.have.been.calledOnce;
    });
  });
});
