describe('AccountModel', function() {
  var AccountModel = require('models/account');

  beforeEach(function() {
    this.AccountModel = new AccountModel({
      id: 1,
      name: 'ACME Inc',
      slug: 'acme-inc',
      image_url: ''
    });
  });

  afterEach(function() {
    this.AccountModel.clear();
    this.AccountModel.destroyCache();
    this.AccountModel.stopListening();
    delete this.AccountModel;
  });

  it('should exist.', function() {
    expect(this.AccountModel).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.AccountModel.name).to.exist;
    expect(this.AccountModel.name).to.equal('Account');
  });

  it('should have a presenters property.', function() {
    expect(this.AccountModel.presenters).to.exist;
    expect(this.AccountModel.presenters).to.eql(['serialize']);
  });

  describe('serialize', function() {
    it('should return the serialized account.', function() {
      expect(this.AccountModel.serialize()).to.eql({
        url: '/acme-inc/',
        name: 'ACME Inc',
        image: '/default/'
      });
    });
  });
});
