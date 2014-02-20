describe('AccountsListItem', function() {
  var AccountsListItem = require('views/accounts-list-item');

  beforeEach(function() {
    this.AccountsListItem = new AccountsListItem({
      model: require('models/account')
    });
  });

  afterEach(function() {
    this.AccountsListItem.remove();
    delete this.AccountsListItem;
  });

  it('should exist.', function() {
    expect(this.AccountsListItem).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.AccountsListItem.name).to.exist;
    expect(this.AccountsListItem.name).to.equal('AccountsListItem');
  });

  it('should have a tagName property.', function() {
    expect(this.AccountsListItem.tagName).to.exist;
    expect(this.AccountsListItem.tagName).to.equal('li');
  });

  it('should have a className property.', function() {
    expect(this.AccountsListItem.className).to.exist;
    expect(this.AccountsListItem.className).to.equal('accounts__account');
  });

  it('should have a model property.', function() {
    expect(this.AccountsListItem.model).to.exist;
  });

  it('should have an template property.', function() {
    expect(this.AccountsListItem.template).to.exist;
  });
});
