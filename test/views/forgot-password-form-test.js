describe('ForgotPasswordForm', function() {
  var formView, server, setFormSpy,
      ForgotPasswordForm = require('views/forgot-password-form'),
      Connection = require('lib/connection');

  before(function() {
    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });
  });

  beforeEach(function() {
    $('#application').append(require('templates/forgot-password')());

    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    setFormSpy = sinon.spy(ForgotPasswordForm.prototype, 'setForm');

    formView = new ForgotPasswordForm({
      model: _.getModel('User')
    });

    formView.render();
  });

  afterEach(function() {
    ForgotPasswordForm.prototype.setForm.restore();
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
    it('should call setForm().', function() {
      expect(setFormSpy).to.have.been.calledOnce;
    });
  });

  describe('onSubmit', function() {
    it('should send the password recovery email if a valid email is provided.', function(done) {
      var url = '/api/auth/forgot_password/',
          contentType = {"Content-Type":"application/json"};

      formView.getAttributeElement('email').val('elving@example.com');

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, '{"token": "' + JWT_TEST_TOKEN + '"}');
      });

      formView.onSubmit({preventDefault: function(){}}).done(function() {
        expect(formView.$('h3')).to.exist;
        expect(formView.model.get('token')).to.exist;
        done();
      }.bind(this));

      server.respond();
    });
  });
});
