describe('Account', function() {
  var Account = require('views/account');

  describe('when instantiated.', function() {
    var account;

    before(function() {
      account = new Account({
        model: require('models/account')
      });
    });

    it('should exist.', function() {
      expect(account).to.exist;
    });

    it('should have a name property.', function() {
      expect(account.name).to.exist;
      expect(account.name).to.equal('Account');
    });

    it('should have a tagName property.', function() {
      expect(account.tagName).to.exist;
      expect(account.tagName).to.equal('li');
    });

    it('should have a className property.', function() {
      expect(account.className).to.exist;
      expect(account.className).to.equal('accounts__account');
    });

    it('should have a model property.', function() {
      expect(account.model).to.exist;
    });

    it('should have an template property.', function() {
      expect(account.template).to.exist;
    });

    after(function() {
      account.unplug(true);
    });
  });
});
