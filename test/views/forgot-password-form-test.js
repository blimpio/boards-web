describe('ForgotPasswordForm', function() {
  var ForgotPasswordForm = require('views/forgot-password-form');

  before(function() {
    $('#application').html(require('templates/forgot-password')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var forgotPasswordForm;

    before(function() {
      forgotPasswordForm = new ForgotPasswordForm();
    });

    it('should exist.', function() {
      expect(forgotPasswordForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(forgotPasswordForm.name).to.exist;
      expect(forgotPasswordForm.name).to.equal('ForgotPasswordForm');
    });

    it('should have a bindings property.', function() {
      expect(forgotPasswordForm.bindings).to.exist;
    });

    after(function() {
      forgotPasswordForm.unplug(true);
    });
  });

  describe('onSubmit()', function() {
    var server, forgotPasswordForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      forgotPasswordForm = new ForgotPasswordForm();
      forgotPasswordForm.render();
    });

    it('should call the forgotPassword method on the user model if the given email is valid.', function(done) {
      server.respondWith('POST', App.API_URL + '/auth/forgot_password/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      forgotPasswordForm.getAttributeElement('email').val('name@example.com');
      forgotPasswordForm.onSubmit({preventDefault: function(){}});
    });

    after(function() {
      server.restore();
      forgotPasswordForm.unplug(true);
    });
  });

  describe('onForgotPasswordSuccess()', function() {
    var forgotPasswordForm;

    before(function() {
      forgotPasswordForm = new ForgotPasswordForm();
      forgotPasswordForm.render();
    });

    it('should render success message.', function() {
      forgotPasswordForm.onForgotPasswordSuccess();
      expect(forgotPasswordForm.$('h3')).to.exist;
    });

    after(function() {
      forgotPasswordForm.unplug(true);
    });
  });

  describe('onForgotPasswordError()', function() {
    var forgotPasswordForm;

    before(function() {
      forgotPasswordForm = new ForgotPasswordForm();
      forgotPasswordForm.render();
    });

    it('should display an error message.', function() {
      forgotPasswordForm.onForgotPasswordError(null, {email: 'error'});
      expect(forgotPasswordForm.getAttributeErrorElement('email').text()).to.equal('error');
    });

    after(function() {
      forgotPasswordForm.unplug(true);
    });
  });
});
