describe('SignupController', function() {
  var controller, token,
      SignupController = require('controllers/signup');

  before(function() {
    token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAic29tZXVzZXJAZXhhbXBsZS5jb20ifQ.heB3Y0qjUMq0cbrzIuz8q0tfn6o3VwKxdTjvUeIEtgM';
  });

  beforeEach(function() {
    controller = new SignupController();
  });

  afterEach(function() {
    controller.remove();
  });

  it('should exist.', function() {
    expect(controller).to.exist;
  });

  describe('initialize', function() {
    it('should init the user model.', function() {
      expect(controller.user).to.exist;
      expect(controller.user.name).to.equal('User');
    });

    it('should render and insert.', function() {
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });

    it('should have a form child view.', function() {
      expect(controller.children.form).to.exist;
    });
  });

  describe('initForm', function() {
    it('should init and render the signup form view.', function() {
      controller.initForm();
      expect(controller.children.form.name).to.equal('SignupForm');
      expect(controller.children.form.isRendered).to.be.true;
    });
  });

  describe('continueWithToken', function() {
    it('should set the email and signup request token in the user model if a token is passed.', function() {
      controller.user.set('signup_step', 1);
      controller.continueWithToken(token);
      expect(controller.user.get('email')).to.equal('someuser@example.com');
      expect(controller.user.get('signup_step')).to.equal(3);
      expect(controller.user.get('signup_request_token')).to.equal(token);
    });
  });
});
