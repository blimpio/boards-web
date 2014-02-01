describe('SignupController', function() {
  before(function() {
    var SignupController = require('controllers/signup');

    this.token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAibmFtZUBleGFtcGxlLmNvbSJ9.PTbp7CGAJ3C4woorlCeWHRKqkcP7ZuiuWxn0FEiK9-0';
    localStorage.setItem('User', '{"email": "name@example.com"}');

    this.controller = new SignupController();
    this.controller.insert('#application');
  });

  it('should exist.', function() {
    expect(this.controller).to.exist;
  });

  it('should have a name.', function() {
    expect(this.controller.name).to.equal('SignupController');
  });

  describe('SignupController.initialize', function() {
    it('should have initialized the user model.', function() {
      expect(this.controller.user).to.exist;
      expect(this.controller.user.name).to.equal('User');
      expect(this.controller.user.moduleName).to.equal('model');
    });

    it('should fetch the model from cache.', function() {
      expect(this.controller.user.hasFetched).to.be.true;
      expect(this.controller.user.get('email')).to.equal('name@example.com');
    });
  });

  describe('SignupController.afterInserted', function() {
    it('should have initialized the signup-form view.', function() {
      expect(this.controller.signupForm).to.exist;
      expect(this.controller.signupForm.name).to.equal('SignupForm');
      expect(this.controller.signupForm.moduleName).to.equal('formView');
    });
  });

  describe('SignupController.continueWithToken', function() {
    it('should render the next signup step (with no token).', function() {
      this.controller.continueWithToken();
      expect(this.controller.user.get('signup_step')).to.equal(1);
    });

    it('should render the next signup step (with no token but waiting for email).', function() {
      this.controller.user.set({
        'email': 'name@example.com',
        'signup_step': 2
      });

      this.controller.continueWithToken();
      expect(this.controller.user.get('signup_step')).to.equal(2);
    });

    it('should render the next signup step (with token).', function() {
      this.controller.continueWithToken({token: this.token});
      expect(this.controller.user.get('email')).to.equal('name@example.com');
      expect(this.controller.user.get('signup_step')).to.equal(3);
    });
  });
});
