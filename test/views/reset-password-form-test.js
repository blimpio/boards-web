describe('ResetPasswordForm', function() {
  var formView, server, setFormSpy,
      ResetPasswordForm = require('views/reset-password-form'),
      Connection = require('lib/connection');

  before(function() {
    $('#application').append(require('templates/reset-password')());

    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });
  });

  beforeEach(function() {
    setFormSpy = sinon.spy(ResetPasswordForm.prototype, 'setForm');

    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    formView = new ResetPasswordForm({
      model: Boards.getUser()
    });

    formView.render();
  });

  afterEach(function() {
    ResetPasswordForm.prototype.setForm.restore();
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
    it('should call setForm().', function() {
      expect(setFormSpy).to.have.been.calledOnce;
    });
  });

  describe('sendPasswordRecoveryEmail', function() {
    it('should send the password recovery email if a valid email.', function(done) {
      var url = '/api/auth/reset_password/',
          contentType = {"Content-Type":"application/json"};

      formView.getAttributeElement('password').val('1234567890');

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, '{"token": "' + JWT_TEST_TOKEN + '"}');
      });

      formView.resetPassword().done(function() {
        expect(formView.model.get('token')).to.exist;
        done();
      }.bind(this));

      server.respond();
    });
  });
});
