describe('BoardsController', function() {
  var BoardsController = require('controllers/boards');

  before(function() {
    localStorage.setItem('User', '{"token": "1234567890"}');

    this.redirectSpy = sinon.spy(BoardsController.prototype, 'redirect');

    this.controller = new BoardsController();
    this.controller.insert('#application');
  });

  after(function() {
    BoardsController.prototype.redirect.restore();
  });

  it('should exist.', function() {
    expect(this.controller).to.exist;
  });

  it('should have a name.', function() {
    expect(this.controller.name).to.equal('BoardsController');
  });

  describe('BoardsController.initialize', function() {
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
});
