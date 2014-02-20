describe('AccountsList', function() {
  var AccountsList = require('views/accounts-list');

  beforeEach(function() {
    $('#application').html(require('templates/accounts')());

    this.AccountsList = new AccountsList({
      collection: _.getCollection('Accounts')
    });
  });

  afterEach(function() {
    this.AccountsList.remove();
    delete this.AccountsList;
  });

  it('should exist.', function() {
    expect(this.AccountsList).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.AccountsList.name).to.exist;
    expect(this.AccountsList.name).to.equal('AccountsList');
  });

  it('should have a list property.', function() {
    expect(this.AccountsList.list).to.exist;
    expect(this.AccountsList.list).to.equal('ol.accounts__list');
  });

  it('should have a collection property.', function() {
    expect(this.AccountsList.collection).to.exist;
    expect(this.AccountsList.collection.name).to.equal('Accounts');
  });

  it('should have an itemView property.', function() {
    expect(this.AccountsList.itemView).to.exist;
  });
});
