describe('ResetPasswordController', function() {
  var controller, passToken,
      ResetPasswordController = require('controllers/reset-password');

  before(function() {
    passToken = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0b2tlbl92ZXJzaW9uIjogIjRlMjMwM2IyLWIwYmEtNDA2OS05NzM2LTBlMDkzZDNmZTQ1NiIsICJ0eXBlIjogIlBhc3N3b3JkUmVzZXQiLCAiaWQiOiAyfQ.4JaqInkg-5p63cHQdJz1pfm7kfijinab9XK1h6jDk-Q';
  });

  beforeEach(function() {
    controller = new ResetPasswordController();
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
  });

  describe('renderForm', function() {
    it('should render and insert the controller.', function() {
      controller.renderForm();
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });
  });

  describe('validateToken', function() {
    it('should set the password reset data from the url token and render the controller.', function() {
      controller.validateToken(JWT_TEST_TOKEN);
      expect(controller.user.get('passwordResetData')).to.exist;
      expect(controller.isRendered).to.be.true;
      expect(controller.isInserted).to.be.true;
    });
  });

  describe('initForm', function() {
    it('should init the form.', function() {
      controller.initForm();
      expect(controller.children.form.name).to.equal('ResetPasswordForm');
    });
  });
});
