describe('ResetPasswordController', function() {
  var server, controller, publishSpy,
      Connection = require('lib/connection'),
      ResetPasswordController = require('controllers/reset-password');

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

    localStorage.setItem('User', '{"token": "'+ JWT_TEST_TOKEN +'"}');

    publishSpy = sinon.spy(ResetPasswordController.prototype, 'publish');
    controller = new ResetPasswordController();
  });

  afterEach(function() {
    server.restore();
    ResetPasswordController.prototype.publish.restore();
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
  });

  describe('renderForm', function() {
    it('should render and insert the controller if the user can reset the password.', function() {
      controller.renderForm();
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });

    it('should navigate to the signin route if the user cant reset the password.', function() {
      controller.user.clear().cache.clearAll();
      controller.renderForm();
      expect(publishSpy).to.have.been.calledWith('router:navigate', 'signin');
    });
  });

  describe('validateToken', function() {
    it('should set the password reset data from the url token and render the controller.', function() {
      controller.validateToken(JWT_TEST_TOKEN);
      expect(controller.user.get('passwordResetData')).to.exist;
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });
  });

  describe('initForm', function() {
    it('should init the form.', function() {
      controller.initForm();
      expect(controller.getChildByName('ResetPasswordForm')).to.exist;
    });
  });
});
