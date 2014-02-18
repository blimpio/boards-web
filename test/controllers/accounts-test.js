describe('AccountsController', function() {
  var controller,
      AccountsController = require('controllers/accounts');

  beforeEach(function() {
    controller = new AccountsController();
  });

  afterEach(function() {
    controller.remove();
  });

  it('should exist.', function() {
    expect(controller).to.exist;
  });

  describe('initialize', function() {
    it('should render and insert.', function() {
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });

    it('should have a accounts child view.', function() {
      expect(controller.children.accounts).to.exist;
    });
  });

  describe('initList', function() {
    it('should init and render the account list view.', function() {
      controller.initList();
      expect(controller.children.accounts.name).to.equal('AccountsList');
      expect(controller.children.accounts.isRendered).to.be.true;
    });
  });
});
