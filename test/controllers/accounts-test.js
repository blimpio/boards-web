describe('AccountsController', function() {
  var AccountsController = require('controllers/accounts');

  afterEach(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var accountsController;

    beforeEach(function() {
      accountsController = new AccountsController();
    });

    it('should exist.', function() {
      expect(accountsController).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountsController.name).to.exist;
      expect(accountsController.name).to.equal('AccountsController');
    });

    it('should have a template property.', function() {
      expect(accountsController.template).to.exist;
    });

    it('should render and insert.', function() {
      expect(accountsController.isRendered).to.be.true;
      expect(accountsController.isInserted).to.be.true;
    });

    it('should have a accounts child view.', function() {
      expect(accountsController.children.accounts).to.exist;
    });

    afterEach(function() {
      accountsController.unplug(true);
    });
  });

  describe('initChildren()', function() {
    var accountsController;

    beforeEach(function() {
      accountsController = new AccountsController();
    });

    it('should init and render the account list view.', function() {
      accountsController.initChildren();
      expect(accountsController.children.accounts).to.exist;
      expect(accountsController.children.accounts.$el.find('li')).to.not.be.empty;
    });

    afterEach(function() {
      accountsController.unplug(true);
    });
  });
});
