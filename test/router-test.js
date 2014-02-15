describe('Router', function() {
  var router, navigateSpy, validateTokenSpy,
      Router = require('router'),
      ResetPassword = require('controllers/reset-password');

  before(function() {
    navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    validateTokenSpy = sinon.spy(ResetPassword.prototype, 'validateToken');

    router = new Router({
      routes: {
        'posts': 'onPosts',
        'posts/:id': 'onPosts'
      },

      onPosts: function(id) {

      }
    });
  });

  Backbone.history.start({pushState: false});

  after(function() {
    Backbone.history.stop();
    Backbone.History.prototype.navigate.restore();
    ResetPassword.prototype.validateToken.restore();
  });

  describe('navigateWithTrigger', function() {
    it('should navigate and trigger the route.', function() {
      router.navigateWithTrigger('posts');
      expect(navigateSpy).to.have.been.calledWith('posts', {trigger: true});
    });
  });

  describe('removeLastController', function() {
    it('should remove the last controller view.', function() {
      router.controller = new Z.View();
      router.removeLastController();
      expect(router.controller.isUnplugged).to.be.true;
    });
  });

  describe('signup', function() {
    it('should init the signup controller view.', function() {
      router.signup();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('SignupController');
    });
  });

  describe('signin', function() {
    it('should init the signin controller view.', function() {
      router.signin();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('SigninController');
    });
  });

  describe('forgotPassword', function() {
    it('should init the forgotPassword controller view.', function() {
      router.forgotPassword();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ForgotPasswordController');
    });
  });

  describe('resetPassword', function() {
    it('should init the resetPassword controller view.', function() {
      router.resetPassword();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ResetPasswordController');
    });
  });

  describe('resetPasswordWithToken', function() {
    it('should init the resetPassword controller view and call the validateToken() method.', function() {
      router.resetPasswordWithToken(JWT_TEST_TOKEN);
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ResetPasswordController');
      expect(validateTokenSpy).to.have.been.calledWith(JWT_TEST_TOKEN);
    });
  });

  describe('signout', function() {
    it('sign out the current user and navigate to the signin route.', function() {
      router.signout();
      expect(_.getModel('User').isSignedIn()).to.be.false;
      expect(navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });
  });

  describe('boards', function() {
    it('should init the boards controller view.', function() {
      router.boards();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('BoardsController');
    });
  });
});
