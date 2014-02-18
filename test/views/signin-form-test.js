describe('SigninForm', function() {
  var formView, server, registerValidationsSpy,
      SigninForm = require('views/signin-form');

  beforeEach(function() {
    $('#application').append('<form class="signin"></form>');

    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    registerValidationsSpy = sinon.spy(SigninForm.prototype, 'registerValidations');

    formView = new SigninForm({
      model: _.getModel('User')
    });

    formView.render();
  });

  afterEach(function() {
    SigninForm.prototype.registerValidations.restore();
    server.restore();
    formView.remove();
  });

  it('should exist.', function() {
    expect(formView).to.exist;
  });

  it('should have a model.', function() {
    expect(formView.model).to.exist;
    expect(formView.model.name).to.equal('User');
  });

  describe('initialize', function() {
    it('should call registerValidations().', function() {
      expect(registerValidationsSpy).to.have.been.calledOnce;
    });
  });

  describe('registerValidations', function() {
    it('should add model validations for username and password attributes.', function() {
      formView.model.unregisterValidation();
      formView.registerValidations();
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
