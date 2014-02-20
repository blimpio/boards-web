describe('SigninForm', function() {
  var SigninForm = require('views/signin-form');

  beforeEach(function() {
    $('#application').html('<form class="signin"></form>');

    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.SigninForm = new SigninForm({
      model: _.getModel('User')
    });

    this.SigninForm.render();
  });

  afterEach(function() {
    this.server.restore();
    delete this.server;
    this.SigninForm.remove();
    delete this.SigninForm;
  });

  it('should exist.', function() {
    expect(this.SigninForm).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.SigninForm.name).to.exist;
    expect(this.SigninForm.name).to.equal('SigninForm');
  });

  it('should have a template property.', function() {
    expect(this.SigninForm.template).to.exist;
  });

  it('should have a subscriptions property.', function() {
    expect(this.SigninForm.subscriptions).to.exist;
  });

  it('should have a model.', function() {
    expect(this.SigninForm.model).to.exist;
    expect(this.SigninForm.model.name).to.equal('User');
  });

  describe('onSubmit', function() {
    it('should call the signin method on the user model if the given username and password are valid.', function(done) {
      this.server.respondWith('POST', '/api/auth/signin/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      this.SigninForm.getAttributeElement('username').val('mctavish');
      this.SigninForm.getAttributeElement('password').val('12345678');
      this.SigninForm.onSubmit({preventDefault: function(){}});
      this.server.respond();
    });
  });

  describe('onAuthError', function() {
    it('should display an error message.', function() {
      this.SigninForm.onAuthError({username: 'error', password: 'error'});
      expect(this.SigninForm.getAttributeErrorElement('username').text()).to.equal('error');
      expect(this.SigninForm.getAttributeErrorElement('password').text()).to.equal('error');
    });
  });
});
