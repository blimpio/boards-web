describe('Helpers', function() {
  describe('_.createController()', function() {
    it('should create a new controller view based on the given path.', function() {
      var controller = _.createController('accounts');
      expect(controller).to.exist;
      expect(controller.name).to.equal('AccountsController');
    });
  });

  describe('_.createView()', function() {
    it('should create a new view based on the given path.', function() {
      var view = _.createView('signin-form');
      expect(view).to.exist;
      expect(view.name).to.equal('SigninForm');
    });
  });

  describe('_.createModel()', function() {
    it('should create a new model based on the given path.', function() {
      var model = _.createModel('user');
      expect(model).to.exist;
      expect(model.name).to.equal('User');
    });
  });

  describe('_.createCollection()', function() {
    it('should create a new collection based on the given path.', function() {
      var collection = _.createCollection('boards');
      expect(collection).to.exist;
      expect(collection.name).to.equal('Boards');
    });
  });

  describe('_.decodeJWT()', function() {
    it('should decode a JSON Web Token.', function() {
      var decoded = _.decodeJWT(JWT_PASSWORD_TOKEN);
      expect(decoded.id).to.equal(2);
      expect(decoded.type).to.equal('PasswordReset');
      expect(decoded.token_version).to.equal('a22c3b1d-dd8d-49ee-9d06-d062f5f47456');
    });
  });

  describe('a[data-route]', function() {
    var navigateSpy;

    before(function() {
      $('#application').html('<a id="navigate" href="/signin/" data-route="true">Navigate</a>');
      navigateSpy = sinon.spy(Backbone.history, 'navigate');
    });

    it('should trigger a route change on click.', function() {
      $('#navigate').click();
      expect(navigateSpy).to.have.been.calledWith('/signin/', {trigger: true});
    });

    after(function() {
      $('#application').empty();
      Backbone.history.navigate.restore();
    });
  });

  describe('{{markdown}}', function() {
    var template;

    before(function() {
      template = Handlebars.compile('{{markdown text}}');
    });

    it('should return parsed markdown.', function() {
      expect(template({text: '#Test'})).to.eql('<h1 id="test">Test</h1>\n');
    });
  });
});
