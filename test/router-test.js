describe('Router', function() {
  var Router = require('router');

  before(function() {
    App.Accounts.reset([{
      id: 1,
      name: 'ACME Inc',
      slug: 'acme-inc',
      image_url: ''
    }]);

    Backbone.history.start({pushState: false});
  });

  after(function() {
    App.Accounts.reset();
    Backbone.history.stop();
  });

  describe('onError()', function() {
    var router, navigateSpy;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    });

    it('should navigate to the signin route if the authIsRequired() validation fails.', function() {
      router.onError({}, 'Auth is required.');
      expect(navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });

    it('should navigate to the accounts route if the accountExists() validation fails.', function() {
      router.onError({}, 'User is not in account.');
      expect(navigateSpy).to.have.been.calledWith('accounts', {trigger: true});
    });

    it('should navigate to the accounts route if the isNotAuthenticated() validation fails.', function() {
      router.onError({}, 'User is already authenticated.');
      expect(navigateSpy).to.have.been.calledWith('accounts', {trigger: true});
    });

    it('should navigate to the accounts route if the hasOneAccount() validation fails.', function() {
      router.onError({}, 'User has only one account.');
      expect(navigateSpy).to.have.been.calledWith('acme-inc', {trigger: true});
    });

    after(function() {
      Backbone.History.prototype.navigate.restore();
    });
  });

  describe('beforeRoute()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should remove the current controller.', function() {
      router.controller = new Z.View();
      router.beforeRoute();
      expect(router.controller.isUnplugged).to.be.true;
    });
  });

  describe('authIsRequired()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should return an error if the user is not signed in.', function() {
      expect(router.authIsRequired({fragment: 'accounts/'})).to.equal('Auth is required.');
    });
  });

  describe('isNotAuthenticated()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should return an error if the user is signed in.', function() {
      App.User.set('token', '12345');
      expect(router.isNotAuthenticated({fragment: 'signin/'})).to.equal('User is already authenticated.');
    });
  });

  describe('accountExists()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should return an error if the user is not in the given account.', function() {
      App.User.set('token', '12345');
      expect(router.accountExists({
        params: ['blimp'],
        fragment: 'blimp/'
      })).to.equal('User is not in account.');
    });
  });

  describe('hasOneAccount()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should return an error if the user has only one account.', function() {
      expect(router.hasOneAccount({
        params: [],
        fragment: 'accounts/'
      })).to.equal('User has only one account.');
    });
  });

  describe('navigateWithTrigger()', function() {
    var router, navigateSpy;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    });

    it('should navigate and trigger the route.', function() {
      router.navigateWithTrigger('signin');
      expect(navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });

    after(function() {
      Backbone.History.prototype.navigate.restore();
    });
  });

  describe('removeLastController()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should remove the last controller view.', function() {
      router.controller = new Z.View();
      router.removeLastController();
      expect(router.controller.isUnplugged).to.be.true;
    });
  });

  describe('signup()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the signup controller view.', function() {
      router.signup();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('SignupController');
    });
  });

  describe('signin()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the signin controller view.', function() {
      router.signin();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('SigninController');
    });
  });

  describe('forgotPassword()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the forgotPassword controller view.', function() {
      router.forgotPassword();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ForgotPasswordController');
    });
  });

  describe('resetPassword()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the resetPassword controller view.', function() {
      router.resetPassword();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ResetPasswordController');
    });
  });

  describe('resetPasswordWithToken()', function() {
    var router,
        ResetPassword = require('controllers/reset-password'),
        validateTokenSpy;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      validateTokenSpy = sinon.spy(ResetPassword.prototype, 'validateToken');
    });

    it('should init the resetPassword controller view and call the validateToken() method.', function() {
      router.resetPasswordWithToken(JWT_PASSWORD_TOKEN);
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ResetPasswordController');
      expect(validateTokenSpy).to.have.been.calledWith(JWT_PASSWORD_TOKEN);
    });

    after(function() {
      ResetPassword.prototype.validateToken.restore();
    });
  });

  describe('signout()', function() {
    var router, navigateSpy;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    });

    it('sign out the current user and navigate to the signin route.', function() {
      router.signout();
      expect(App.User.isSignedIn()).to.be.false;
      expect(navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });

    after(function() {
      Backbone.History.prototype.navigate.restore();
    });
  });

  describe('accounts()', function() {
    var router;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the accounts controller view.', function() {
      router.accounts();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('AccountsController');
    });
  });

  describe('account()', function() {
    var router, server;

    before(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      server = sinon.fakeServer.create();
      server.autoRespond = true;
    });

    it('should init the account controller view.', function(done) {
      server.respondWith('GET', '/api/boards/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '[]');
        done();
      });

      router.account();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('AccountController');
    });

    after(function() {
      server.restore();
    });
  });
});
