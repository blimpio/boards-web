describe('AccountModel', function() {
  var AccountModel = require('models/account');

  describe('when instantiated.', function() {
    var accountModel;

    before(function() {
      accountModel = new AccountModel({
        id: 1,
        name: 'ACME Inc',
        slug: 'acme-inc',
        image_url: ''
      });
    });

    it('should exist.', function() {
      expect(accountModel).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountModel.name).to.exist;
      expect(accountModel.name).to.equal('Account');
    });

    it('should have a presenters property.', function() {
      expect(accountModel.presenters).to.exist;
      expect(accountModel.presenters).to.eql(['serialize']);
    });

    after(function() {
      accountModel.clear();
    });
  });

  describe('serialize()', function() {
    var accountModel;

    before(function() {
      accountModel = new AccountModel({
        id: 1,
        name: 'ACME Inc',
        slug: 'acme-inc',
        image_url: ''
      });
    });

    it('should return the serialized account.', function() {
      expect(accountModel.serialize().name).to.equal('ACME Inc');
    });

    after(function() {
      accountModel.clear();
    });
  });
});
