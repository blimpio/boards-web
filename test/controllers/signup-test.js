describe('SignupController', function() {
  var controller, publishSpy,
      SignupController = require('controllers/signup');

  beforeEach(function() {
    localStorage.setItem('User', '{"token": "' + JWT_TEST_TOKEN + '"}');
    publishSpy = sinon.spy(SignupController.prototype, 'publish');
    controller = new SignupController();
  });

  after(function() {
    controller.remove();
    localStorage.clear();
    $('#application').empty();
  });

  afterEach(function() {
    SignupController.prototype.publish.restore();
  });

  it('should exist.', function() {
    expect(controller).to.exist;
  });

  describe('initialize', function() {
    it('should init the user model.', function() {
      expect(controller.user).to.exist;
      expect(controller.user.name).to.equal('User');
    });

    it('should fetch the model from cache.', function() {
      expect(controller.user.get('token')).to.equal(JWT_TEST_TOKEN);
    });

    it('should render and insert the controller if the user is logged out.', function() {
      controller.user.clear().cache.clearAll();
      controller.user.set('signup_step', 1);
      controller.initialize();
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });

    it('should navigate to the boards route if the user is logged in.', function() {
      controller.initialize();
      expect(publishSpy).to.have.been.calledWith('router:navigate', 'boards');
    });
  });

  describe('initForm', function() {
    it('should init the form.', function() {
      controller.initForm();
      expect(controller.getChildByName('SignupForm')).to.exist;
    });
  });
});
