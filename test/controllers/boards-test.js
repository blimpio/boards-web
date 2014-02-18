describe('BoardsController', function() {
  var controller,
      BoardsController = require('controllers/boards');

  beforeEach(function() {
    controller = new BoardsController();
  });

  afterEach(function() {
    controller.remove();
  });

  it('should exist.', function() {
    expect(controller).to.exist;
  });

  describe('intialize', function() {
    it('should render and insert.', function() {
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });
  });
});
