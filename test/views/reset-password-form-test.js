describe('ResetPasswordForm', function() {
  var formView, server, setFormSpy,
      ResetPasswordForm = require('views/reset-password-form'),
      Connection = require('lib/connection');

  before(function() {
    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });
  });

  beforeEach(function() {
    $('#application').append(require('templates/reset-password')());

    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    setFormSpy = sinon.spy(ResetPasswordForm.prototype, 'setForm');

    formView = new ResetPasswordForm({
      model: _.getModel('User')
    });

    formView.render();
  });

  afterEach(function() {
    ResetPasswordForm.prototype.setForm.restore();
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
    it('should reset the password if a valid password is provided.', function(done) {
      var url = '/api/auth/reset_password/',
          contentType = {"Content-Type":"application/json"};

      formView.getAttributeElement('password').val('1234567890');

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, '{"token": "' + JWT_TEST_TOKEN + '"}');
      });

      formView.onSubmit({preventDefault: function(){}}).done(function() {
        expect(formView.model.get('token')).to.exist;
        done();
      }.bind(this));

      server.respond();
    });
  });
});
