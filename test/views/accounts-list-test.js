describe('AccountsList', function() {
  var list,
      AccountsList = require('views/accounts-list');

  beforeEach(function() {
    $('#application').append(require('templates/accounts')());

    list = new AccountsList({
      model: _.getModel('User')
    });
  });

  afterEach(function() {
    list.remove();
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
});
