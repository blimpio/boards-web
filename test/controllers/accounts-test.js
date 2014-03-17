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
      expect(accountsController._isRendered).to.be.true;
      expect(accountsController._isInserted).to.be.true;
    });

    it('should have a accounts child view.', function() {
      expect(accountsController.getView('accounts')).to.exist;
    });

    afterEach(function() {
      accountsController.unplug(true);
    });
  });
});
