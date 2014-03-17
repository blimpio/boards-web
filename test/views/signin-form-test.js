describe('SigninForm', function() {
  var SigninForm = require('views/signin-form');

  before(function() {
    $('#application').html('<form class="signin"></form>');
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var signinForm;

    before(function() {
      signinForm = new SigninForm({
        model: _.createModel('user')
      });
    });

    it('should exist.', function() {
      expect(signinForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(signinForm.name).to.exist;
      expect(signinForm.name).to.equal('SigninForm');
    });

    it('should have a template property.', function() {
      expect(signinForm.template).to.exist;
    });

    it('should have a model.', function() {
      expect(signinForm.model).to.exist;
      expect(signinForm.model.name).to.equal('User');
    });

    after(function() {
      signinForm.unplug(true);
    });
  });

  describe('onSubmit()', function() {
    var server, signinForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;

      signinForm = new SigninForm({
        model: _.createModel('user')
      });

      signinForm.render();
    });

    it('should call the signin method on the user model if the given username and password are valid.', function(done) {
      server.respondWith('POST', '/api/auth/signin/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, 'OK');
        done();
      });

      signinForm.getAttributeElement('username').val('mctavish');
      signinForm.getAttributeElement('password').val('12345678');
      signinForm.onSubmit({preventDefault: function(){}});
    });

    after(function() {
      server.restore();
      signinForm.unplug(true);
    });
  });

  describe('onAuthError()', function() {
    var signinForm;

    before(function() {
      signinForm = new SigninForm({
        model: _.createModel('user')
      });

      signinForm.render();
    });

    it('should display an error message.', function() {
      signinForm.onAuthError({username: 'error', password: 'error'});
      expect(signinForm.getAttributeErrorElement('username').text()).to.equal('error');
      expect(signinForm.getAttributeErrorElement('password').text()).to.equal('error');
    });

    after(function() {
      signinForm.unplug(true);
    });
  });
});
