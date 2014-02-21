describe('HeaderView', function() {
  var HeaderView = require('views/header');

  beforeEach(function() {
    this.HeaderView = new HeaderView({
      model: App.User
    });
  });

  afterEach(function() {
    this.HeaderView.remove();
    delete this.HeaderView;
  });

  it('should exist.', function() {
    expect(this.HeaderView).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.HeaderView.name).to.exist;
    expect(this.HeaderView.name).to.equal('Header');
  });

  it('should have a template property.', function() {
    expect(this.HeaderView.template).to.exist;
  });

  it('should have a model.', function() {
    expect(this.HeaderView.model).to.exist;
    expect(this.HeaderView.model.name).to.equal('User');
  });

  describe('initAccountsDropdown', function() {
    it('should init and render accounts dropdown view.', function() {
      this.HeaderView.initAccountsDropdown();
      expect(this.HeaderView.children.accounts).to.exist;
    });
  });

  describe('context', function() {
    it('should return the template context.', function() {
      var context = this.HeaderView.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['isSignedIn']);
    });
  });
});
