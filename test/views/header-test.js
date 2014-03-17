describe('HeaderView', function() {
  var HeaderView = require('views/header');

  describe('when instantiated.', function() {
    var headerView;

    before(function() {
      headerView = new HeaderView();
    });

    it('should exist.', function() {
      expect(headerView).to.exist;
    });

    it('should have a name property.', function() {
      expect(headerView.name).to.exist;
      expect(headerView.name).to.equal('Header');
    });

    it('should have a template property.', function() {
      expect(headerView.template).to.exist;
    });

    it('should have a model.', function() {
      expect(headerView.model).to.exist;
      expect(headerView.model.name).to.equal('User');
    });

    it('should have child views.', function() {
      expect(headerView.getView('accounts')).to.exist;
    });

    after(function() {
      headerView.unplug(true);
    });
  });

  describe('context()', function() {
    var headerView;

    before(function() {
      headerView = new HeaderView();
    });

    it('should return the template context.', function() {
      var context = headerView.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['isSignedIn']);
    });

    after(function() {
      headerView.unplug(true);
    });
  });
});
