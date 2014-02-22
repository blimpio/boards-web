describe('AccountsCollection', function() {
  var AccountsController = require('collections/accounts');

  describe('when instantiated.', function() {
    var accountsController;

    before(function() {
      accountsController = new AccountsController([{
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
      expect(accountsController).to.exist;
    });

    it('should have a url property.', function() {
      expect(accountsController.url).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountsController.name).to.exist;
      expect(accountsController.name).to.equal('Accounts');
    });

    it('should have a model property.', function() {
      expect(accountsController.model).to.exist;
    });

    it('should have a presenters property.', function() {
      expect(accountsController.presenters).to.exist;
      expect(accountsController.presenters).to.eql(['accounts']);
    });

    after(function() {
      accountsController.reset();
    });
  });

  describe('userHasAccount()', function() {
    var accountsController;

    before(function() {
      accountsController = new AccountsController([{
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
      expect(accountsController.userHasAccount('blimp')).to.be.true;
      expect(accountsController.userHasAccount('acme-inc')).to.be.true;
    });

    it('should return false if the given slug does not match a user account.', function() {
      expect(accountsController.userHasAccount('boards')).to.be.false;
      expect(accountsController.userHasAccount('acme-llc')).to.be.false;
    });

    after(function() {
      accountsController.reset();
    });
  });

  describe('setCurrent()', function() {
    var accountsController;

    before(function() {
      accountsController = new AccountsController([{
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
      accountsController.setCurrent('blimp');
      expect(accountsController.current).to.equal(4);
      accountsController.setCurrent('acme-inc');
      expect(accountsController.current).to.equal(1);
    });

    it('should set the current property to null given a slug does not match any account.', function() {
      accountsController.setCurrent('acme-llc');
      expect(accountsController.current).to.be.null;
    });

    after(function() {
      accountsController.reset();
    });
  });

  describe('accounts()', function() {
    var accountsController;

    before(function() {
      accountsController = new AccountsController([{
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
      expect(accountsController.accounts()).to.eql([{
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
      accountsController.reset();
    });
  });

  describe('account()', function() {
    var accountsController;

    before(function() {
      accountsController = new AccountsController([{
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
      expect(accountsController.account(4)).to.eql({
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      });
    });

    after(function() {
      accountsController.reset();
    });
  });

  describe('currentAccount()', function() {
    var accountsController;

    before(function() {
      accountsController = new AccountsController([{
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
      accountsController.current = 4;
      expect(accountsController.currentAccount()).to.eql({
        url: '/blimp/',
        name: 'Blimp LLC',
        image: '/default/'
      });
    });

    after(function() {
      accountsController.reset();
    });
  });
});
