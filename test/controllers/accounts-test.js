describe('AccountsController', function() {
  var AccountsController = require('controllers/accounts'),
      AccountsCollection = require('collections/accounts');

  before(function() {
    Boards.Collections.Accounts = new AccountsCollection([{
      id: 1,
      name: 'ACME Inc',
      slug: 'acme-inc',
      image_url: ''
    }, {
      id: 4,
      name: 'Blimp LLC',
      slug: 'blimp',
      image_url: ''
    }]);
  });

  beforeEach(function() {
    this.AccountsController = new AccountsController();
  });

  afterEach(function() {
    this.AccountsController.remove();
    delete this.AccountsController;
  });

  after(function() {
    Boards.Collections.Accounts.reset();
    delete Boards.Collections.Accounts;
  });

  it('should exist.', function() {
    expect(this.AccountsController).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.AccountsController.name).to.exist;
    expect(this.AccountsController.name).to.equal('AccountsController');
  });

  it('should have a template property.', function() {
    expect(this.AccountsController.template).to.exist;
  });

  it('should render and insert.', function() {
    expect(this.AccountsController.isRendered).to.be.true;
    expect(this.AccountsController.isInserted).to.be.true;
  });

  it('should have a accounts child view.', function() {
    expect(this.AccountsController.children.accounts).to.exist;
  });

  describe('initList', function() {
    it('should init and render the account list view.', function() {
      this.AccountsController.initList();
      expect(this.AccountsController.children.accounts).to.exist;
      expect(this.AccountsController.children.accounts.$el.find('li')).to.not.be.empty;
    });
  });
});
