describe('BoardsController', function() {
  var controller, publishSpy,
      BoardsController = require('controllers/boards');

  beforeEach(function() {
    localStorage.setItem('User', '{"token": "' + JWT_TEST_TOKEN + '"}');
    publishSpy = sinon.spy(BoardsController.prototype, 'publish');
    controller = new BoardsController();
  });

  after(function() {
    controller.remove();
    localStorage.clear();
    $('#application').empty();
  });

  afterEach(function() {
    BoardsController.prototype.publish.restore();
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

    it('should navigate to the signin route if the user is logged out.', function() {
      controller.user.clear().cache.clearAll();
      controller.initialize();
      expect(publishSpy).to.have.been.calledWith('router:navigate', 'signin');
    });
  });
});
