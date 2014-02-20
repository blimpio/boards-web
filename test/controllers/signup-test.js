describe('SignupController', function() {
  var SignupController = require('controllers/signup');

  before(function() {
    this.token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAic29tZXVzZXJAZXhhbXBsZS5jb20ifQ.heB3Y0qjUMq0cbrzIuz8q0tfn6o3VwKxdTjvUeIEtgM';
  });

  beforeEach(function() {
    this.SignupController = new SignupController();
  });

  afterEach(function() {
    this.SignupController.remove();
    delete this.SignupController;
  });

  it('should exist.', function() {
    expect(this.SignupController).to.exist;
  });

  it('should init the user model.', function() {
    expect(this.SignupController.user).to.exist;
    expect(this.SignupController.user.name).to.equal('User');
  });

  it('should render and insert.', function() {
    expect(this.SignupController.isRendered).to.be.true;
    expect(this.SignupController.isInserted).to.be.true;
  });

  it('should have a form child view.', function() {
    expect(this.SignupController.children.form).to.exist;
  });

  describe('initForm', function() {
    it('should init and render the signup form view.', function() {
      this.SignupController.initForm();
      expect(this.SignupController.children.form).to.exist;
      expect(this.SignupController.children.form.isRendered).to.be.true;
    });
  });

  describe('continueWithToken', function() {
    it('should set the email and signup request token in the user model if a token is passed.', function() {
      this.SignupController.user.set('signup_step', 1);
      this.SignupController.continueWithToken(this.token);
      expect(this.SignupController.user.get('email')).to.equal('someuser@example.com');
      expect(this.SignupController.user.get('signup_step')).to.equal(3);
      expect(this.SignupController.user.get('signup_request_token')).to.equal(this.token);
    });
  });
});
