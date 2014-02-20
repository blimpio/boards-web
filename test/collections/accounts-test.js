describe('AccountsCollection', function() {
  var AccountsCollection = require('collections/accounts');

  beforeEach(function() {
    this.AccountsCollection = new AccountsCollection([{
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

  afterEach(function() {
    this.AccountsCollection.reset();
    this.AccountsCollection.stopListening();
    delete this.AccountsCollection;
  });

  it('should exist.', function() {
    expect(this.AccountsCollection).to.exist;
  });

  it('should have a url property.', function() {
    expect(this.AccountsCollection.url).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.AccountsCollection.name).to.exist;
    expect(this.AccountsCollection.name).to.equal('Accounts');
  });

  it('should have a model property.', function() {
    expect(this.AccountsCollection.model).to.exist;
  });

  it('should have a presenters property.', function() {
    expect(this.AccountsCollection.presenters).to.exist;
    expect(this.AccountsCollection.presenters).to.eql(['accounts']);
  });

  describe('userHasAccount', function() {
    it('should return true if the given slug matches a user account.', function() {
      expect(this.AccountsCollection.userHasAccount('blimp')).to.be.true;
      expect(this.AccountsCollection.userHasAccount('acme-inc')).to.be.true;
    });

    it('should return false if the given slug does not match a user account.', function() {
      expect(this.AccountsCollection.userHasAccount('boards')).to.be.false;
      expect(this.AccountsCollection.userHasAccount('acme-llc')).to.be.false;
    });
  });

  describe('setCurrent', function() {
    it('should set the current property to the id of the matched account given a slug.', function() {
      this.AccountsCollection.setCurrent('blimp');
      expect(this.AccountsCollection.current).to.equal(4);
      this.AccountsCollection.setCurrent('acme-inc');
      expect(this.AccountsCollection.current).to.equal(1);
    });

    it('should set the current property to null given a slug does not match any account.', function() {
      this.AccountsCollection.setCurrent('acme-llc');
      expect(this.AccountsCollection.current).to.be.null;
    });
  });

  describe('accounts', function() {
    it('should return an array of serialized accounts.', function() {
      expect(this.AccountsCollection.accounts()).to.eql([{
        url: '/acme-inc/',
        name: 'ACME Inc',
        image: '/default/'
      }, {
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      }]);
    });
  });

  describe('account', function() {
    it('should return a serialized account given an id.', function() {
      expect(this.AccountsCollection.account(4)).to.eql({
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      });
    });
  });

  describe('currentAccount', function() {
    it('should return a the current account serialized.', function() {
      this.AccountsCollection.current = 4;
      expect(this.AccountsCollection.currentAccount()).to.eql({
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      });
    });
  });
});
