describe('AccountsList', function() {
  var list,
      AccountsList = require('views/accounts-list');

  before(function() {
    $('#application').append(require('templates/accounts')());
  });

  beforeEach(function() {
    list = new AccountsList({
      model: Boards.getUser()
    });
  });

  after(function() {
    list.remove();
    $('#application').empty();
  });

  it('should exist.', function() {
    expect(list).to.exist;
  });

  it('should have a model.', function() {
    expect(list.model).to.exist;
    expect(list.model.name).to.equal('User');
  });

  describe('context', function() {
    it('should return the user accounts.', function() {
      list.model.set('accounts', [{id: 1, name: 'A'}, {id: 2, name: 'B'}]);
      expect(list.context().accounts().length).to.equal(2);
    });
  });

  describe('onAccountsChange', function() {
    it('should render the list.', function() {
      list.onAccountsChange();
      expect(list.isRendered).to.be.true;
    });
  });
});
