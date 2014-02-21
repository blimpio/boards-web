describe('AccountsDropdown', function() {
  var AccountsDropdown = require('views/accounts-dropdown');

  before(function() {
    App.Accounts.reset([{
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
    $('#application').html('<div class="accounts-dropdown"></div>');

    this.AccountsDropdown = new AccountsDropdown({
      collection: App.Accounts
    });

    this.AccountsDropdown.render();
  });

  afterEach(function() {
    this.AccountsDropdown.remove();
    delete this.AccountsDropdown;
  });

  after(function() {
    App.Accounts.reset();
  });

  it('should exist.', function() {
    expect(this.AccountsDropdown).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.AccountsDropdown.name).to.exist;
    expect(this.AccountsDropdown.name).to.equal('AccountsDropdown');
  });

  it('should have a template property.', function() {
    expect(this.AccountsDropdown.template).to.exist;
  });

  it('should have a collection property.', function() {
    expect(this.AccountsDropdown.collection).to.exist;
    expect(this.AccountsDropdown.collection.name).to.equal('Accounts');
  });

  it('should have an events property.', function() {
    expect(this.AccountsDropdown.events).to.exist;
  });

  it('should have an elements property.', function() {
    expect(this.AccountsDropdown.elements).to.exist;
  });

  describe('context', function() {
    it('should return the template context.', function() {
      var context = this.AccountsDropdown.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['accounts', 'currentAccount']);
    });
  });

  describe('toggle', function() {
    it('should toggle the dropdown element.', function() {
      this.AccountsDropdown.toggle();
      expect(this.AccountsDropdown.$('ol.accounts-dropdown__list').is(':visible')).to.be.true;
    });
  });
});
