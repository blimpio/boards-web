describe('AccountsCollection', function() {
  var AccountsCollection = require('collections/accounts');

  describe('when instantiated.', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should exist.', function() {
      expect(accountsCollection).to.exist;
    });

    it('should have a url property.', function() {
      expect(accountsCollection.url).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountsCollection.name).to.exist;
      expect(accountsCollection.name).to.equal('Accounts');
    });

    it('should have a model property.', function() {
      expect(accountsCollection.model).to.exist;
    });

    it('should have a presenters property.', function() {
      expect(accountsCollection.presenters).to.exist;
      expect(accountsCollection.presenters).to.eql(['accounts']);
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('userHasAccount()', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should return true if the given slug matches a user account.', function() {
      expect(accountsCollection.userHasAccount('blimp')).to.be.true;
      expect(accountsCollection.userHasAccount('acme-inc')).to.be.true;
    });

    it('should return false if the given slug does not match a user account.', function() {
      expect(accountsCollection.userHasAccount('boards')).to.be.false;
      expect(accountsCollection.userHasAccount('acme-llc')).to.be.false;
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('setCurrent()', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should set the current property to the id of the matched account given a slug.', function() {
      accountsCollection.setCurrent('blimp');
      expect(accountsCollection.current).to.equal(4);
      accountsCollection.setCurrent('acme-inc');
      expect(accountsCollection.current).to.equal(1);
    });

    it('should set the current property to null given a slug does not match any account.', function() {
      accountsCollection.setCurrent('acme-llc');
      expect(accountsCollection.current).to.be.null;
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('getCurrent()', function() {
    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should get the current account.', function() {
      accountsCollection.setCurrent('blimp');
      expect(accountsCollection.getCurrent().id).to.equal(4);
      expect(accountsCollection.getCurrent().get('name')).to.equal('Blimp LLC');
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('accounts()', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should return an array of serialized accounts.', function() {
      expect(accountsCollection.accounts()).to.eql([{
        url: '/acme-inc/',
        name: 'ACME Inc',
        image: '/default/'
      }, {
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      }]);
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('account()', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should return a serialized account given an id.', function() {
      expect(accountsCollection.account(4)).to.eql({
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      });
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('currentAccount()', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should return a the current account serialized.', function() {
      accountsCollection.current = 4;
      expect(accountsCollection.currentAccount()).to.eql({
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      });
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('getSlug()', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection([{
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

    it('should return the slug of the current account.', function() {
      accountsCollection.current = 4;
      expect(accountsCollection.getSlug()).to.equal('blimp');
    });

    it('should return an empty string if there is no current account.', function() {
      accountsCollection.current = undefined;
      expect(accountsCollection.getSlug()).to.equal('');
    });

    after(function() {
      accountsCollection.reset();
    });
  });

  describe('onUserAuth()', function() {
    var accountsCollection;

    before(function() {
      accountsCollection = new AccountsCollection();
    });

    it('should reset the collection with the given user accounts.', function() {
      expect(accountsCollection.length).to.equal(0);
      accountsCollection.onUserAuth({
        accounts: [{
          id: 1,
          name: 'ACME Inc',
          slug: 'acme-inc',
          image_url: ''
        }, {
          id: 4,
          name: 'Blimp LLC',
          slug: 'blimp',
          image_url: ''
        }]
      });
      expect(accountsCollection.length).to.equal(2);
    });

    after(function() {
      accountsCollection.reset();
    });
  });
});
