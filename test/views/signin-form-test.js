describe('SigninForm', function() {
  var formView, server, addValidationsSpy,
      SigninForm = require('views/signin-form'),
      Connection = require('lib/connection');

  before(function() {
    $('#application').append('<form class="signin"></form>');

    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });
  });

  beforeEach(function() {
    addValidationsSpy = sinon.spy(SigninForm.prototype, 'addValidations');

    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    formView = new SigninForm({
      model: Boards.getUser()
    });

    formView.render();
  });

  afterEach(function() {
    SigninForm.prototype.addValidations.restore();
    server.restore();
  });

  after(function() {
    formView.remove();
    $('#application').empty();
  });

  it('should exist.', function() {
    expect(formView).to.exist;
  });

  it('should have a model.', function() {
    expect(formView.model).to.exist;
    expect(formView.model.name).to.equal('User');
  });

  describe('initialize', function() {
    it('should call addValidations().', function() {
      expect(addValidationsSpy).to.have.been.calledOnce;
    });
  });

  describe('addValidations', function() {
    it('should add model validations for username and password attributes.', function() {
      formView.model.removeValidation();
      formView.addValidations();
      expect(formView.model.validations.username).to.exist;
      expect(formView.model.validations.password).to.exist;
    });
  });

  describe('onSubmit', function() {
    it('should signin the user.', function(done) {
      var url = '/api/auth/signin/',
          contentType = {"Content-Type":"application/json"};

      formView.getAttributeElement('username').val('elving');
      formView.getAttributeElement('password').val('123456789');

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, '{"token": "' + JWT_TEST_TOKEN + '"}');
      });

      formView.onSubmit({preventDefault: function(){}}).done(function() {
        expect(formView.model.get('token')).to.exist;
        expect(formView.model.isSignedIn()).to.be.true;
        done();
      }.bind(this));

      server.respond();
    });
  });
});
