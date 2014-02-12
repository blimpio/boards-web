describe('ForgotPasswordController', function() {
  var server, controller, publishSpy,
      Connection = require('lib/connection'),
      ForgotPasswordController = require('controllers/forgot-password');

  before(function() {
    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });
  });

  beforeEach(function() {
    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    localStorage.setItem('User', '{"token": "' + JWT_TEST_TOKEN + '"}');

    publishSpy = sinon.spy(ForgotPasswordController.prototype, 'publish');
    controller = new ForgotPasswordController();
  });

  afterEach(function() {
    server.restore();
    ForgotPasswordController.prototype.publish.restore();
  });

  after(function() {
    controller.remove();
    localStorage.clear();
    $('#application').empty();
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

    it('should navigate to the boards route if the user is logged in.', function() {
      expect(publishSpy).to.have.been.calledWith('router:navigate', 'boards');
    });

    it('should render and insert the controller if the user is logged out.', function() {
      controller.user.clear().cache.clearAll();
      controller.initialize();
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });

    it('should init the form if the user is logged out.', function() {
      controller.user.clear().cache.clearAll();
      controller.initialize();
      expect(controller.getChildByName('ForgotPasswordForm')).to.exist;
    });
  });

  describe('initForm', function() {
    it('should init the form.', function() {
      controller.initForm();
      expect(controller.getChildByName('ForgotPasswordForm')).to.exist;
    });
  });
});
