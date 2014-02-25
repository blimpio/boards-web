describe('AccountsList', function() {
  var AccountsList = require('views/accounts-list');

  before(function() {
    $('#application').html(require('templates/accounts')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var accountsList;

    before(function() {
      accountsList = new AccountsList();
    });

    it('should exist.', function() {
      expect(accountsList).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountsList.name).to.exist;
      expect(accountsList.name).to.equal('AccountsList');
    });

    it('should have a list property.', function() {
      expect(accountsList.list).to.exist;
      expect(accountsList.list).to.equal('ol.accounts__list');
    });

    it('should have a collection property.', function() {
      expect(accountsList.collection).to.exist;
      expect(accountsList.collection.name).to.equal('Accounts');
    });

    it('should have an itemView property.', function() {
      expect(accountsList.itemView).to.exist;
    });

    after(function() {
      accountsList.unplug(true);
    });
  });
});
