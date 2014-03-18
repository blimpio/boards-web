describe('AccountsDropdown', function() {
  var AccountsDropdown = require('views/accounts-dropdown');

  before(function() {
    $('#application').html('<div class="accounts-dropdown"></div>');
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var accountsDropdown;

    before(function() {
      accountsDropdown = new AccountsDropdown();
      accountsDropdown.render();
    });

    it('should exist.', function() {
      expect(accountsDropdown).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountsDropdown.name).to.exist;
      expect(accountsDropdown.name).to.equal('AccountsDropdown');
    });

    it('should have a template property.', function() {
      expect(accountsDropdown.template).to.exist;
    });

    it('should have a collection property.', function() {
      expect(accountsDropdown.collection).to.exist;
      expect(accountsDropdown.collection.name).to.equal('Accounts');
    });

    after(function() {
      accountsDropdown.unplug(true);
    });
  });

  describe('context()', function() {
    var accountsDropdown;

    before(function() {
      accountsDropdown = new AccountsDropdown();
      accountsDropdown.render();
    });

    it('should return the template context.', function() {
      var context = accountsDropdown.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['accounts', 'currentAccount']);
    });

    after(function() {
      accountsDropdown.unplug(true);
    });
  });
});
