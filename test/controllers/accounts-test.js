describe('AccountsController', function() {
  var controller, publishSpy,
      Connection = require('lib/connection'),
      AccountsController = require('controllers/accounts');

  before(function() {
    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });
  });

  beforeEach(function() {
    localStorage.setItem('User', '{"token": "' + JWT_TEST_TOKEN + '"}');
    publishSpy = sinon.spy(AccountsController.prototype, 'publish');
    controller = new AccountsController();
  });

  after(function() {
    controller.remove();
    localStorage.clear();
    $('#application').empty();
  });

  afterEach(function() {
    AccountsController.prototype.publish.restore();
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

  describe('initList', function() {
    it('should init the list.', function() {
      controller.initList();
      expect(controller.getChildByName('AccountsList')).to.exist;
    });
  });

  describe('onAccountsFetch', function() {
    it('should render the list if there are more than 1 account available.', function() {
      controller.onAccountsFetch([{id: 1}, {id: 2}]);
      expect(controller.getChildByName('AccountsList').isRendered).to.be.true;
    });

    it('should navigate to boards route if there is less than 1 account available.', function() {
      controller.onAccountsFetch([{id: 1}]);
      expect(publishSpy).to.have.been.calledWith('router:navigate', 'boards');
    });
  });
});
