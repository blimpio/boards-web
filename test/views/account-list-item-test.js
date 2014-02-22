describe('AccountsListItem', function() {
  var AccountsListItem = require('views/accounts-list-item');

  describe('when instantiated.', function() {
    var accountsListItem;

    before(function() {
      accountsListItem = new AccountsListItem({
        model: require('models/account')
      });
    });

    it('should exist.', function() {
      expect(accountsListItem).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountsListItem.name).to.exist;
      expect(accountsListItem.name).to.equal('AccountsListItem');
    });

    it('should have a tagName property.', function() {
      expect(accountsListItem.tagName).to.exist;
      expect(accountsListItem.tagName).to.equal('li');
    });

    it('should have a className property.', function() {
      expect(accountsListItem.className).to.exist;
      expect(accountsListItem.className).to.equal('accounts__account');
    });

    it('should have a model property.', function() {
      expect(accountsListItem.model).to.exist;
    });

    it('should have an template property.', function() {
      expect(accountsListItem.template).to.exist;
    });

    after(function() {
      accountsListItem.unplug(true);
    });
  });
});
