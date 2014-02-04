describe('SignupController', function() {
  var SignupController = require('controllers/signup');

  before(function() {
    this.token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAibmFtZUBleGFtcGxlLmNvbSJ9.PTbp7CGAJ3C4woorlCeWHRKqkcP7ZuiuWxn0FEiK9-0';
    localStorage.setItem('User', '{"email": "name@example.com"}');

    this.redirectSpy = sinon.spy(SignupController.prototype, 'redirect');

    this.controller = new SignupController();
    this.controller.insert('#application');
  });

  after(function() {
    SignupController.prototype.redirect.restore();
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

    it('should redirect to boards route if the user is logged in.', function() {
      this.controller.user.set('token', '12345');
      this.controller.initialize();
      expect(this.redirectSpy).to.have.been.calledOnce;
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
