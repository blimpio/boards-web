describe('SigninForm', function() {
  var SigninForm = require('views/signin-form');
  var Connection = require('lib/connection');

  before(function() {
    jQuery.ajaxSetup({
      processData: false
    });

    this.Application = require('application');

    this.Application.connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });

    $('#application').append('<form class="signin"></form>');
  });

  beforeEach(function() {
    this.addValidationsSpy = sinon.spy(SigninForm.prototype, 'addValidations');

    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.form = new SigninForm({
      model: require('models/user')
    });

    this.form.render();
  });

  afterEach(function() {
    SigninForm.prototype.addValidations.restore();

    this.server.restore();
  });

  after(function() {
    this.form.dispose();
    delete this.form;
  });

  it('should exist.', function() {
    expect(this.form).to.exist;
  });

  it('should have a name.', function() {
    expect(this.form.name).to.equal('SigninForm');
  });

  it('should have a model.', function() {
    expect(this.form.model).to.exist;
    expect(this.form.model.name).to.equal('User');
  });

  describe('SigninForm.initialize', function() {
    it('should call SigninForm.addValidations.', function() {
      expect(this.addValidationsSpy).to.have.been.calledOnce;
    });
  });

  describe('SigninForm.addValidations', function() {
    it('should add model validations for username and password attributes.', function() {
      this.form.model.validations = {};
      expect(this.form.model.validations.username).to.not.exist;
      expect(this.form.model.validations.password).to.not.exist;
      this.form.addValidations();
      expect(this.form.model.validations.username).to.exist;
      expect(this.form.model.validations.password).to.exist;
    });
  });

  describe('SigninForm.signin', function() {
    it('should signin the user.', function(done) {
      var url = '/api/auth/signin/',
          contentType = {"Content-Type":"application/json"};

      this.form.setAttribute('username', 'fulano');
      this.form.setAttribute('password', 'password1');

      this.server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, '{"token": "1234567890"}');
      });

      this.form.signin().done(function() {
        expect(this.form.model.get('token')).to.exist;
        expect(this.form.model.isSignedIn()).to.be.true;
        done();
      }.bind(this));

      this.server.respond();
    });
  });
});
