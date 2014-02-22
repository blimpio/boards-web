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

    it('should have an events property.', function() {
      expect(accountsDropdown.events).to.exist;
    });

    it('should have an elements property.', function() {
      expect(accountsDropdown.elements).to.exist;
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

  describe('toggle()', function() {
    var accountsDropdown;

    before(function() {
      accountsDropdown = new AccountsDropdown();
      accountsDropdown.render();
    });

    it('should toggle the dropdown element.', function() {
      accountsDropdown.toggle();
      expect(accountsDropdown.$('ol.accounts-dropdown__list').is(':visible')).to.be.true;
    });

    after(function() {
      accountsDropdown.unplug(true);
    });
  });
});
